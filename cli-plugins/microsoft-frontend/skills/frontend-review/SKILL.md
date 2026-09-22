---
name: frontend-review
description: Review a React frontend for user experience, Fluent UI consistency, accessibility, responsiveness, maintainability, and readiness. Use after implementation, during pull request review, or when diagnosing an inconsistent or difficult interface.
---

# Frontend Review

Perform an evidence-based review. Do not rewrite the application before identifying the highest-impact problems.

## Review workflow

1. Restate the primary user and task.
2. Inspect the rendered experience at representative desktop and narrow widths when available.
3. Trace the primary keyboard flow.
4. Review loading, empty, no-results, partial, error, permission, and success states.
5. Inspect component reuse, state ownership, API boundaries, typing, tests, and styling.
6. Review Fluent component selection, tokens, themes, and custom controls.
7. Rank findings by impact and confidence.
8. Recommend the smallest change that resolves each problem.

## Severity

- **Blocker**: prevents task completion, creates a serious accessibility barrier, loses data, or exposes a security issue.
- **High**: causes frequent confusion, broken responsive behavior, or unreliable interaction.
- **Medium**: inconsistency or maintainability issue with meaningful user or engineering cost.
- **Low**: polish or local cleanup with limited impact.

## Finding format

For every finding include: severity, location, observed evidence, user or engineering impact, recommended change, and verification step. Separate verified defects from suggestions. Do not report a preference as an accessibility failure without evidence.

## References

- [UX review checklist](references/ux-checklist.md)
- [Fluent review checklist](references/fluent-checklist.md)
- [Engineering review checklist](references/engineering-checklist.md)
- [Accessibility review checklist](references/accessibility-checklist.md)
