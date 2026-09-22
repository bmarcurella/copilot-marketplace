---
name: dashboard-builder
description: Design and implement operational dashboards, admin portals, management consoles, and AI or agent operations experiences. Use when users need metrics, filters, tables, status, activity, approvals, runs, tools, knowledge sources, or drill-down workflows.
---

# Dashboard Builder

Build decision-oriented operational experiences rather than collections of disconnected cards.

## Required workflow

1. Identify the operational decisions and actions the dashboard must support.
2. Define the entities, statuses, time ranges, filters, and data freshness expectations.
3. Choose overview metrics only when they support a decision.
4. Make a table, list, timeline, or work queue the primary surface when it better supports the task.
5. Define drill-down paths and preserve filter context.
6. Expose source, freshness, partial data, and permission limitations.
7. Add reusable application components and typed view models.
8. Validate responsive density, keyboard operation, empty states, long text, and large data sets.

## Dashboard rules

- Every metric must answer a user question.
- Pair status with meaning and a next action.
- Do not use a chart if a value, table, or trend sentence communicates the decision more clearly.
- Keep filters discoverable and show active filters.
- Preserve sorting, paging, and selection semantics.
- Distinguish current status from historical trend.
- Do not imply real-time data unless the source provides it.
- Use confirmation and consequence messaging for consequential actions.

## Agent experience vocabulary

Consider reusable patterns such as `AgentCard`, `AgentStatusBadge`, `RunTable`, `ExecutionTimeline`, `ApprovalQueue`, `ToolInvocation`, `KnowledgeSource`, `HumanHandoff`, `UsageMetric`, and `AuditActivity`. These are application patterns, not replacements for Fluent primitives.

## References

- [Dashboard patterns](references/dashboard-patterns.md)
- [Agent operations patterns](references/agent-operations-patterns.md)
- [Data trust](references/data-trust.md)
