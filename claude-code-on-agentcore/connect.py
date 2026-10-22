"""
Connect to Claude Code on AgentCore Runtime via WebSocket Shell.

This script opens an interactive PTY (pseudo-terminal) session to a remote
Firecracker microVM running Claude Code. A PTY gives you a full terminal
experience — colors, cursor movement, Ctrl+C — as if you were SSH'd into
a remote machine.

Three modes:
  - Interactive (default): full terminal, just like running `claude` locally
  - Headless (--prompt): fire a task and stream output, agent keeps running
    even if you disconnect
  - Command (--cmd): run a shell command on the microVM and exit
"""

import argparse
import asyncio
import functools
import os
import sys
import termios
import tty
import uuid
import websockets

from bedrock_agentcore.runtime import AgentCoreRuntimeClient
from bedrock_agentcore.runtime.shell import ShellChannel, ShellSession

# AgentCore cold starts can exceed the WebSocket client's 10-second default.
websockets.connect = functools.partial(websockets.connect, open_timeout=120)


async def interactive_pty(shell: ShellSession, initial_cmd: str | None = None):
    """
    Full interactive PTY session.

    How it works:
    1. Puts your local terminal into "raw mode" (keypresses sent immediately,
       no local echo — the remote side handles everything)
    2. Forwards your keystrokes to the remote shell via WebSocket
    3. Forwards remote output back to your terminal
    4. Restores your terminal settings on exit
    """
    old_settings = termios.tcgetattr(sys.stdin)
    try:
        tty.setraw(sys.stdin.fileno())
        cols, rows = os.get_terminal_size()
        await shell.resize(cols, rows)

        if initial_cmd:
            await shell.send(initial_cmd)

        loop = asyncio.get_event_loop()
        stdin_fd = sys.stdin.fileno()

        async def read_stdin():
            while True:
                data = await loop.run_in_executor(None, os.read, stdin_fd, 4096)
                if not data:
                    break
                await shell.send_bytes(data)

        stdin_task = asyncio.create_task(read_stdin())
        try:
            async for frame in shell:
                if frame.channel == ShellChannel.STDOUT:
                    os.write(sys.stdout.fileno(), frame.payload)
                elif frame.channel == ShellChannel.STDERR:
                    os.write(sys.stderr.fileno(), frame.payload)
                elif frame.channel in (ShellChannel.STATUS, ShellChannel.CLOSE):
                    break
        finally:
            stdin_task.cancel()
            try:
                await stdin_task
            except asyncio.CancelledError:
                pass
    finally:
        termios.tcsetattr(sys.stdin, termios.TCSADRAIN, old_settings)
        print()


async def stream_output(shell: ShellSession, initial_cmd: str, capture: bool = False):
    """
    Stream output from a headless command.

    The remote microVM continues executing even after this function returns
    or the local process is interrupted — this is the "close your laptop"
    capability.

    When capture=True, collects raw output and returns it stripped of PTY
    noise (ANSI escapes, echoed command, shell prompts, 'logout' line).
    """
    import re
    await shell.send(initial_cmd)
    raw = ""
    async for frame in shell:
        if frame.channel == ShellChannel.STDOUT:
            if capture:
                raw += frame.text
            else:
                print(frame.text, end="", flush=True)
        elif frame.channel == ShellChannel.STDERR:
            print(frame.text, end="", file=sys.stderr, flush=True)
        elif frame.channel in (ShellChannel.STATUS, ShellChannel.CLOSE):
            break
    if capture:
        clean = re.sub(r'\x1b\[[0-9;]*[A-Za-z]|\x1b\[\?[0-9]*[hl]|\x1b\][^\x07]*\x07?|\r', '', raw)
        start_marker = "\n___OUTPUT_START___\n"
        end_marker = "\n___OUTPUT_END___"
        start_idx = clean.find(start_marker)
        end_idx = clean.find(end_marker, start_idx + len(start_marker)) if start_idx != -1 else -1
        if start_idx != -1 and end_idx != -1:
            content = clean[start_idx + len(start_marker):end_idx]
            if content.endswith("\n"):
                return content
            return content + "\n"
        return ""
    return None


async def run(args):
    runtime_arn = args.runtime_arn or os.environ.get("RUNTIME_ARN")
    if not runtime_arn:
        print("Error: provide --runtime-arn or set RUNTIME_ARN env var")
        sys.exit(1)

    region = args.region or os.environ.get("AWS_REGION", "us-west-2")

    # Session ID determines which microVM you connect to.
    # Same ID = same VM (reconnect). New ID = fresh VM.
    session_id = args.session or str(uuid.uuid4())
    shell_id = str(uuid.uuid4())

    client = AgentCoreRuntimeClient(region=region)

    print(f"Connecting to AgentCore Runtime...", file=sys.stderr)
    print(f"  Runtime: {runtime_arn}", file=sys.stderr)
    print(f"  Session: {session_id}", file=sys.stderr)
    print(file=sys.stderr)

    async with client.open_shell(
        runtime_arn=runtime_arn,
        session_id=session_id,
        shell_id=shell_id,
    ) as shell:
        if args.prompt:
            safe_prompt = args.prompt.replace("'", "'\\''")
            cmd = f"/app/run.sh '{safe_prompt}'; exit\n"
            print(f"Running prompt: {args.prompt}\n", file=sys.stderr)
            await stream_output(shell, cmd)
        elif args.cmd:
            sentinel_start = "___OUTPUT_START___"
            sentinel_end = "___OUTPUT_END___"
            cmd = f"echo '{sentinel_start}' && {args.cmd} && echo '{sentinel_end}'; exit\n"
            output = await stream_output(shell, cmd, capture=True)
            if output:
                sys.stdout.write(output)
        else:
            cmd = "/app/run.sh\n"
            print("Connected! Launching Claude Code...\n", file=sys.stderr)
            await interactive_pty(shell, cmd)

    print(f"\nTo reconnect to this session:", file=sys.stderr)
    print(f"  python connect.py --session {session_id}", file=sys.stderr)


def main():
    parser = argparse.ArgumentParser(
        description="Connect to Claude Code on AgentCore Runtime",
        epilog="Examples:\n"
               "  python connect.py                          # Interactive session\n"
               "  python connect.py --session abc-123        # Reconnect to existing session\n"
               "  python connect.py --prompt 'Fix the bug'   # Headless (fire-and-forget)\n"
               "  python connect.py --cmd 'ls /mnt/skills'   # Run a shell command\n",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("--runtime-arn", help="AgentCore Runtime ARN (or set RUNTIME_ARN env var)")
    parser.add_argument("--region", help="AWS region (default: us-west-2)")
    parser.add_argument("--session", help="Session ID — reuse to reconnect to the same microVM")
    parser.add_argument("--prompt", help="Run a prompt in headless mode (fire-and-forget)")
    parser.add_argument("--cmd", help="Run a raw shell command on the microVM")
    args = parser.parse_args()
    try:
        asyncio.run(run(args))
    except KeyboardInterrupt:
        print("\nDisconnecting (the remote session keeps running)...")


if __name__ == "__main__":
    main()