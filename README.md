# Claude Code on Amazon Bedrock

> Supercharge your team development with Claude Code on Bedrock

In this hands-on workshop, you will learn how to accelerate team development and scale Claude Code deployments on Amazon Bedrock. You'll discover how to configure team environments, establish standards and workflows, and maximize Claude Code's capabilities to transform coding workflows — making code writing, debugging, testing, and project management more efficient across your organization. Additionally, you'll learn advanced deployment patterns for Claude agents using the Agent SDK on Amazon Bedrock AgentCore Runtime. The workshop emphasizes best practices from Anthropic and Amazon (such as AI-DLC, Spec-Driven Development, and Agent SOPs) to help teams get the most out of this powerful AI coding assistant.

**Suitable for:** Developers, engineering leaders, technical leads, and DevOps professionals from small to large teams looking to learn Claude Code concepts to improve productivity and scale, and/or roll out Claude Code to their team.

**Level:** 300 (Advanced) — No background knowledge necessary, though familiarity with TypeScript or Python and AWS services will be useful.

**Duration:** ~3 hours

> This workshop is optimized for AWS-run events. If running in your own AWS account, ensure you clean up any unused resources to avoid incurring costs.

## Agenda

| Time | Duration | Session |
|------|----------|---------|
| 8:00 – 8:15 | 15 min | Introduction & Getting Started |
| 8:15 – 9:15 | 60 min | Lab 1: Setup Claude Code for teams |
| 9:15 – 10:00 | 45 min | Lab 2: Establish team standards and workflows |
| 10:00 – 10:45 | 45 min | Lab 3: Level up your team with always-on agents, plugins, and search |
| 10:45 – 11:30 | 45 min | Lab 4: Scale confidently with visibility, cost controls, and secure practices |
| 11:30 – 12:00 | 30 min | Lab 5: Beyond Claude Code, Summary & Closing |

## Session Details

### Introduction & Getting Started (15 min)
- Supercharge your team development with Claude Code on Bedrock
- Setup your workshop & IDE
- Setup your AWS environment in terminal

### Lab 1: Setup Claude Code for Teams (60 min)

Configure Claude Code to work with Amazon Bedrock and learn deployment patterns for scaling across your team.

**What you'll learn:**
- Configure your environment and select models in Amazon Bedrock
- Plan team capacity by understanding Amazon Bedrock quotas
- Monitor costs and set up AWS budgets to track team usage
- *(Optional)* Choose authentication patterns and infrastructure options for your team deployment
- *(Optional)* Install the IDE extension to use Claude Code in VS Code

### Lab 2: Establish Team Standards and Workflows (45 min)

Learn advanced Claude Code techniques to enhance your development workflow and enable effective team collaboration. You'll establish team standards, master the Explore-Plan-Code-Commit methodology, scale workflows with Agent Skills, and manage large projects efficiently.

**What you'll learn:**
- Establish team standards with CLAUDE.md files and custom slash commands
- Learn the drawbacks of vibe coding and how the Explore-Plan-Code-Commit methodology provides systematic development with specialized agents
- Learn context engineering with Agent Skills and how to scale domain expertise across your team through reusable, composable workflows
- Manage large projects by maintaining context and navigating complex codebases efficiently
- *(Optional)* Explore session productivity tips: ask side questions with `/btw`, run prompts on a schedule with `/loop`, and work with images, data, and Jupyter notebooks
- *(Optional)* Use git and parallel workflows: leverage git worktrees, interact with project history, and orchestrate teams of Claude Code sessions
- *(Optional)* Extend Claude Code with integrations: connect Agent Skills to remote APIs with browser automation, use Agent Toolkit for AWS for current documentation and scoped AWS inspection, and automate guardrails with hooks

### Lab 3: Level Up Your Team with Always-On Agents, Plugins, and Search (45 min)

Scale beyond your local machine by running persistent agents, distributing reusable workflows as plugins across your team, and connecting Claude Code to real-time web information.

**Prerequisites:** Complete Lab 1 (team setup) and have Claude Code configured with Amazon Bedrock before proceeding.

**What you'll learn:**
- **Run always-on agents** — Fire off a coding task, close your laptop, and come back to find the work done using Amazon Bedrock AgentCore Runtime
- **Distribute workflows as plugins** — Install existing plugins, fork and customize them into your own marketplace, and enforce team-wide standards
- **Add web search** — Connect Claude Code to real-time web information using Amazon Bedrock AgentCore
- **Explore patterns and plugins** — Discover popular community plugins and try hands-on examples for documentation, quality gates, and more

### Lab 4: Scale Confidently with Visibility, Cost Controls, and Secure Practices (45 min)

Learn how to govern Claude Code usage across your organization — controlling who can access which models, enforcing spend limits, attributing cost to individual developers, and establishing secure practices.

**What you'll be working with:**
- **Claude Apps Gateway** — a native solution built into the `claude` binary. Developers sign in with corporate SSO instead of holding API keys, and the gateway enforces model access, per-user spend limits, and managed settings server-side on every request.
- **Amazon CloudWatch Coding Agent Insights** — managed dashboards showing adoption, token usage, cost, and productivity per developer. They populate automatically from the telemetry the gateway relays — no build or deploy required.

> Spend limits stop a request before inference happens. The dashboards tell you what was spent after the fact. Each is useful on its own, and you can adopt them in either order.

**What you'll learn:**
- Connect Claude Code through the Claude Apps Gateway with SSO authentication
- Enforce per-group model access and spend limits via the gateway's Admin API
- Deliver managed settings centrally — permissions, hooks, MCP restrictions, and environment variables — without touching developer machines
- Explain how the gateway relays identity-stamped usage telemetry to Amazon CloudWatch
- Attribute cost, token usage, and productivity to individual developers in Coding Agent Insights
- *(Optional)* Establish secure governance practices for team deployments

### Lab 5: Beyond Claude Code, Summary & Closing (30 min)

Explore the broader Claude ecosystem on AWS — from building production agents to using Claude across every surface where you work.

#### Claude Agent SDK on Amazon Bedrock AgentCore

Claude Agent SDK gives you the same tools, agent loop, and context management that power Claude Code, packaged as a library. Your agents get real tool execution (Bash, file editing, web search, MCP), battle-tested reasoning patterns, and powerful context engineering through skills and CLAUDE.md files.

Amazon Bedrock AgentCore handles the hard parts of production deployment — session management, security, scaling, and observability — so you focus on what your agent does, not how it runs.

**Example use cases:**
- **Front-line engineer agent** — Triages production incidents by reading logs, running diagnostics, and suggesting fixes
- **Background SRE agent** — Continuously monitors system health and proactively addresses issues before they become outages
- **Data platform agent** — Automatically detects schema changes, updates downstream pipelines, and validates data quality
- **Security compliance agent** — Scans repositories, identifies vulnerabilities, and generates remediation pull requests

#### Claude Desktop

Claude Desktop is the graphical companion to Claude Code — ideal for visual context, parallel development branches, or multimodal workflows.

**Key capabilities for developers:**
- **Native worktrees** — Work on multiple branches simultaneously, each in its own Claude conversation with full project context
- **Parallel Claude sessions** — Run multiple Claude instances side by side for different tasks
- **Multimodal input** — Drag and drop screenshots, diagrams, or design mockups directly into the conversation
- **MCP integration** — Connect to the same MCP servers you use in Claude Code, with a visual interface for managing connections

Claude Desktop shares the same model access through Amazon Bedrock, so your team's quotas, spend limits, and governance policies apply uniformly across both surfaces.

#### Claude API

For fully custom integrations, the Claude API (via the Anthropic SDK or Amazon Bedrock's InvokeModel API) gives you programmatic access to build:
- Custom chat interfaces and internal tools
- Automated pipelines that process documents, generate reports, or review code at scale
- Embedded AI features within your existing applications
- Batch processing workflows for large-scale analysis

#### One Ecosystem, Many Surfaces

Whether you're using Claude Code in the terminal, Claude Desktop for visual workflows, or the Claude API for custom integrations — your Amazon Bedrock configuration, spend limits, and governance policies apply consistently. The skills and patterns built in this workshop transfer directly to every Claude surface.

## Repository Structure

```
.
├── CLAUDE.md                  # Team coding standards and workflow configuration
├── .claude/                   # Claude Code settings and custom commands
└── 2048-react-game/           # Lab demo: React 2048 game built via the EPCC workflow
```

## Workshop Link

[Claude Code on Amazon Bedrock — AWS Workshop Catalog](https://catalog.workshops.aws/claude-code-on-amazon-bedrock/en-US)
