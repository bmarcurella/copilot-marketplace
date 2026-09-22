---
name: fluent-ui
description: Implement or review React interfaces with Fluent UI React v9. Use for Fluent components, design tokens, theming, Griffel styles, Microsoft-oriented visual language, accessibility, component selection, or replacing custom controls with Fluent UI.
---

# Fluent UI React v9

Use Fluent UI React v9 as the default component system for Microsoft-oriented React applications.

## Required workflow

1. Confirm the project uses React and identify its installed Fluent package version.
2. Inspect existing application components and theme configuration before adding new primitives.
3. Consult current Fluent UI documentation when a component API or behavior is uncertain.
4. Map the experience design to existing Fluent components.
5. Compose application-specific components from Fluent primitives.
6. Style with Fluent design tokens and theme-aware Griffel styles.
7. Verify keyboard operation, focus visibility, accessible names, contrast, zoom, high contrast, and light or dark themes where supported.

## Implementation rules

- Prefer `@fluentui/react-components` for a Fluent UI React v9 application.
- Prefer an existing Fluent component over recreating the same control.
- Prefer semantic Fluent tokens over hard-coded colors, spacing, typography, radius, shadows, and motion.
- Preserve the accessibility behavior of Fluent components.
- Keep application components separate from low-level Fluent primitives.
- Customize composition and information hierarchy before replacing component internals.
- Do not invent component props. Verify unfamiliar APIs against current documentation.
- Do not mix v8 and v9 packages accidentally. If migration or coexistence is intentional, document the boundary.
- Provide `FluentProvider` and an explicit theme at the application boundary.
- Use icons to reinforce labels, not replace essential labels without an accessible name.

## Verification

Report which Fluent components and token categories were used, any custom primitives created and why, theme coverage, and accessibility checks completed.

## References

- [Component selection](references/component-selection.md)
- [Tokens and theming](references/tokens-and-theming.md)
- [Accessibility](references/accessibility.md)
