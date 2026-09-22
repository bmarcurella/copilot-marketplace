# Microsoft Frontend

A GitHub Copilot Agent Plugin containing five complementary skills for designing, building, and reviewing polished Microsoft-oriented web applications.

## Skills

- `frontend-design`: Turns user goals into workflows, information hierarchy, page structure, state coverage, and component architecture.
- `fluent-ui`: Implements accessible, theme-aware interfaces with Fluent UI React v9 and Fluent design tokens.
- `react-typescript`: Applies maintainable React and TypeScript patterns, typed boundaries, state ownership, testing, and teaching guidance.
- `dashboard-builder`: Builds operational dashboards, admin portals, and AI or agent operations experiences.
- `frontend-review`: Reviews UX, Fluent consistency, accessibility, responsiveness, and frontend engineering quality.

## Suggested usage

Ask Copilot naturally. The skill descriptions are designed to let Copilot select the appropriate skill for the task.

Examples:

- Design an agent operations dashboard before writing code.
- Implement this page with Fluent UI React v9 and theme-aware tokens.
- Refactor this component into maintainable React and TypeScript.
- Review this frontend for UX, accessibility, Fluent consistency, and engineering quality.

## Install from Brandon's marketplace

```bash
copilot plugin marketplace add bmarcurella/copilot-marketplace
copilot plugin install microsoft-frontend@copilot-marketplace
```

## Validate in the marketplace repository

From the repository root:

```bash
node scripts/validate.mjs
```

## Scope

This plugin contains skills only. It does not require or configure an MCP server.
