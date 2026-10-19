<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="brand/logo-on-dark.svg">
    <img src="brand/logo-on-light.svg" alt="Pixel Atelier" width="320">
  </picture>
</p>

<p align="center">Pixels, crafted with care. A calm React UI kit whose pixel effects appear only at the moment of interaction.</p>

> Work in progress. See [`docs/brief.md`](docs/brief.md) and [`docs/decisions.md`](docs/decisions.md).

## Packages

| Package | Contents |
| --- | --- |
| `packages/tokens` | CSS variables and the Tailwind v4 theme (dark/light, accents) |
| `packages/ui` | Components (Radix primitives, cva variants, pixel effects) |
| `apps/storybook` | Development, interaction tests, visual regression |
| `apps/docs` | Docs site and shadcn registry |

## Development

Requires Node 22+ (24 recommended, see `.nvmrc`) and pnpm (`corepack enable`).

```sh
pnpm install
pnpm check      # lint, typecheck, test, build
```

## License

MIT
