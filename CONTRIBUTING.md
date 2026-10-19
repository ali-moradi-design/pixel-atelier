# Contributing

## Component checklist

- [ ] Written from scratch; other kits are studied for ideas only.
- [ ] One file per component in `packages/ui/src/components`, exported from
      `src/index.ts`; no side effects at module level.
- [ ] TSDoc on the component (what it is, when to use it, `@example`) and on
      every prop (meaning of each allowed value, `@default`). Prop unions are
      written out, not derived with `VariantProps`.
- [ ] Classes use the `pa-` theme (`bg-pa-raised`, `text-pa-muted`); logical
      properties (`ps-`, `pe-`, `start-`) so RTL works.
- [ ] Every pixel effect runs on keyboard focus too, not only on hover, and
      becomes a plain change under `prefers-reduced-motion`.
- [ ] Effect nodes are created on first interaction only; big effects use canvas
      or CSS masks.
- [ ] Tests: behavior with Testing Library, `expectNoAxeViolations`, and a story
      in `apps/storybook/stories`.
- [ ] Variants never set the same property twice (checked by
      `test/class-conflicts.test.ts`; add new cva helpers there).
- [ ] A size budget in `packages/ui/.size-limit.json`.

## Commands

```sh
pnpm install
pnpm check                                  # lint, typecheck, test, build
pnpm --filter pixel-atelier size            # bundle size budgets
pnpm --filter @pixel-atelier/storybook dev  # Storybook on :6006
```
