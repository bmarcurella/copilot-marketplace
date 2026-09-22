---
name: react-typescript
description: Build or refactor maintainable React frontends with TypeScript. Use for component architecture, typed props, state, hooks, API boundaries, testing, error handling, or explaining React and TypeScript patterns while implementing a frontend.
---

# React and TypeScript Engineering

Build readable, typed, testable frontend code while explaining important patterns in practical terms.

## Required workflow

1. Inspect the existing framework, TypeScript configuration, package manager, linting, tests, and project conventions.
2. Define domain types at boundaries before implementing rendering logic.
3. Separate presentation, interaction state, server data, business rules, and API access.
4. Sketch the component tree and ownership of state.
5. Implement the smallest cohesive components.
6. Add loading, empty, error, permission, and success behavior.
7. Test user-visible behavior and critical transformations.
8. Explain new patterns, why they are used, and the simplest alternative.

## Engineering rules

- Use TypeScript and avoid `any` unless a documented boundary makes it unavoidable.
- Prefer functional components and composition.
- Keep state close to the components that own it.
- Derive values during render when possible instead of synchronizing redundant state.
- Use effects for synchronization with external systems, not ordinary calculations.
- Keep network calls behind a typed service, query, or adapter boundary.
- Model async state explicitly.
- Avoid oversized components and premature abstraction.
- Reuse a component after a pattern is stable, not merely because two blocks look temporarily similar.
- Preserve stable keys, predictable event handling, and unidirectional data flow.
- Never expose secrets in browser code.

## Teaching mode

When introducing a non-obvious pattern, explain: what it is, why it matters, how it applies here, a common misconception, and one small exercise.

## References

- [Component architecture](references/component-architecture.md)
- [State and effects](references/state-and-effects.md)
- [API boundaries](references/api-boundaries.md)
- [Testing](references/testing.md)
