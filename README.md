# Claude Code on Amazon Bedrock

> Supercharge your team development with Claude Code on Bedrock

A hands-on workshop for accelerating team development and scaling Claude Code on Amazon Bedrock. You'll configure team environments, establish standards and workflows, run always-on agents, govern costs, and explore the broader Claude ecosystem — guided by best practices from Anthropic and Amazon including AI-DLC, Spec-Driven Development, and Agent SOPs.

**Suitable for:** Developers, engineering leaders, technical leads, and DevOps professionals looking to improve productivity or roll out Claude Code to their team.

**Level:** 300 (Advanced) — familiarity with TypeScript or Python and AWS services is helpful but not required.

**Duration:** ~3 hours · AWS-run events only

---

## Agenda

| Time | Duration | Session |
|------|----------|---------|
| 8:00 – 8:15 | 15 min | Getting Started |
| 8:15 – 9:15 | 60 min | Lab 1: Setup Claude Code for teams |
| 9:15 – 10:00 | 45 min | Lab 2: Establish team standards and workflows |
| 10:00 – 10:45 | 45 min | Lab 3: Level up your team with always-on agents, plugins, and search |
| 10:45 – 11:30 | 45 min | Lab 4: Scale confidently with visibility, cost controls, and secure practices |
| 11:30 – 12:00 | 30 min | Lab 5: Beyond Claude Code · Summary & Closing |

---

## Labs

### Getting Started (15 min)
- Set up your workshop and IDE
- Configure your AWS environment in terminal

---

### Lab 1: Setup Claude Code for Teams (60 min)

Configure Claude Code to work with Amazon Bedrock and learn deployment patterns for scaling across your team.

- Configure your environment and select models in Amazon Bedrock
- Plan team capacity by understanding Amazon Bedrock quotas
- Monitor costs and set up AWS budgets to track team usage
- *(Optional)* Choose authentication patterns and infrastructure options for your team deployment
- *(Optional)* Install the IDE extension to use Claude Code in VS Code

---

### Lab 2: Establish Team Standards and Workflows (45 min)

Establish team standards, master the Explore-Plan-Code-Commit (EPCC) methodology, scale workflows with Agent Skills, and manage large projects efficiently.

- Establish team standards with CLAUDE.md files and custom slash commands
- Learn how EPCC provides systematic development with specialized agents — replacing ad-hoc "vibe coding"
- Scale domain expertise across your team with reusable, composable Agent Skills
- Manage large projects by maintaining context and navigating complex codebases efficiently

**Optional — Session productivity tips:**
- Ask side questions with `/btw` · Drive work to completion with `/goal` · Run prompts on a schedule with `/loop`
- Work beyond code: images, data, and Jupyter notebooks
- Automate guardrails and workflows with hooks
- Analyze your sessions with `/insights` · Improve your skills with `/skill-creator` · Tune with `/effort` and auto mode

**Optional — Git and parallel workflows:**
- Use git worktrees for parallel workflows
- Interact with git to understand project history and context
- Orchestrate teams of Claude Code sessions with agent teams and dynamic workflows

**Optional — Integrations:**
- Connect Skills to remote APIs via browser automation using AgentCore Browser Tool
- Use Agent Toolkit for AWS with Claude Code

---

### Lab 3: Level Up Your Team with Always-On Agents, Plugins, and Search (45 min)

Run persistent agents, distribute reusable workflows as plugins, and connect Claude Code to real-time web information.

- **Always-on agents** — Fire off a task, close your laptop, and return to find the work done using Amazon Bedrock AgentCore Runtime
- **Plugin distribution** — Install, fork, and customize plugins into your own team marketplace to enforce standards
- **Web search** — Connect Claude Code to real-time information using Amazon Bedrock AgentCore
- **Patterns and plugins** — Hands-on examples: Security review · Smart documentation · Quality gates

---

### Lab 4: Scale Confidently with Visibility, Cost Controls, and Secure Practices (45 min)

Govern Claude Code across your organization — controlling model access, enforcing spend limits, attributing costs to individual developers, and establishing secure practices.

**Claude Apps Gateway** — built into the `claude` binary. Developers sign in with corporate SSO; the gateway enforces model access, per-user spend limits, and managed settings server-side on every request. No API keys on developer machines.

**Amazon CloudWatch Coding Agent Insights** — managed dashboards for adoption, token usage, cost, and productivity per developer, populated automatically from gateway telemetry. Nothing to build or deploy.

> Spend limits block requests before inference. Dashboards report what was spent afterward. Adopt either independently, in any order.

- Connect Claude Code through the Claude Apps Gateway with SSO authentication
- Enforce per-group model access and spend limits via the gateway's Admin API
- Deliver managed settings centrally — permissions, hooks, MCP restrictions, and environment variables
- Route identity-stamped usage telemetry to Amazon CloudWatch and Coding Agent Insights
- *(Optional)* Establish secure governance practices: security hooks, MCP approval workflows, dev container isolation

---

### Lab 5: Beyond Claude Code (30 min)

Explore the broader Claude ecosystem on AWS.

**Claude Agent SDK on Amazon Bedrock AgentCore** — the same tools, agent loop, and context management that power Claude Code, packaged as a library. AgentCore handles production deployment: isolated execution, credentials, auto-scaling, and observability.

Example agent use cases:
- Front-line engineer — triages incidents by reading logs, running diagnostics, suggesting fixes
- Background SRE — monitors system health and addresses issues before they become outages
- Data platform — detects schema changes, updates pipelines, validates data quality
- Security compliance — scans repos, identifies vulnerabilities, generates remediation PRs

**Claude Desktop** — the graphical companion to Claude Code for visual context, native worktrees, parallel sessions, multimodal input (screenshots, diagrams), and MCP integration.

**Claude API** — programmatic access via the Anthropic SDK or Amazon Bedrock InvokeModel for custom chat interfaces, automated pipelines, embedded AI features, and batch processing workflows.

**One ecosystem, many surfaces** — your Amazon Bedrock configuration, spend limits, and governance policies apply consistently across Claude Code, Claude Desktop, and the Claude API.

---

## Key Takeaways

| Lab | What you walked away with |
|-----|--------------------------|
| Lab 1 | Claude Code running on Bedrock, team capacity planned, costs monitored, auth pattern selected |
| Lab 2 | CLAUDE.md standards, EPCC workflow, Agent Skills library, git worktrees, hook automation |
| Lab 3 | Always-on agents via AgentCore, plugin marketplace, web search, reusable security/doc/quality patterns |
| Lab 4 | Claude Apps Gateway with SSO, per-group spend limits, centralized settings, CloudWatch dashboards |
| Lab 5 | Agent SDK on AgentCore for production agents, Claude Desktop + API integration patterns |

---

## Additional Resources

- [Claude Code documentation](https://docs.anthropic.com/en/docs/claude-code)
- [Claude Code best practices](https://docs.anthropic.com/en/docs/claude-code/best-practices)
- [Claude Code on Amazon Bedrock — deployment guide](https://docs.anthropic.com/en/docs/claude-code/amazon-bedrock)
- [Equipping agents with Agent Skills](https://docs.anthropic.com/en/docs/claude-code/agent-skills)
- [Agent Toolkit for AWS](https://github.com/anthropics/agent-toolkit)
- [Amazon Bedrock documentation](https://docs.aws.amazon.com/bedrock/)
- [Anthropic on AWS workshop](https://catalog.workshops.aws/anthropic-on-aws/en-US)

---

## Repository Structure

```
.
├── CLAUDE.md                  # Team coding standards and workflow configuration
├── .claude/                   # Claude Code settings and custom commands
└── 2048-react-game/           # Lab demo: React 2048 game built via the EPCC workflow
```

[Open in AWS Workshop Catalog](https://catalog.workshops.aws/claude-code-on-amazon-bedrock/en-US)
