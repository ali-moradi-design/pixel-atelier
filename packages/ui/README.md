# pixelbits

Pixels, crafted with care. A calm React 19 UI kit whose pixel effects appear
only at the moment of interaction (hover, focus, open, loading), and always on
keyboard focus too.

- 39 components and 5 blocks, each its own tree-shakable entry
  (`pixelbits/button` is about 2 kB brotli).
- Built on the platform: native `<dialog>`, the popover API, real form inputs.
- Tailwind v4 theme with light/dark and four accents; or a precompiled
  stylesheet for apps without Tailwind.
- Full TSDoc on every component and prop; WCAG AA colors; RTL ready.

Docs and live demos: https://pixelbits.ali-moradi-develop.com

## Install

```sh
pnpm add pixelbits
```

With Tailwind v4:

```css
@import "tailwindcss";
@import "pixelbits/theme.css";
```

Without Tailwind:

```ts
import "pixelbits/styles.css";
```

## Use

```tsx
import { Button } from "pixelbits/button";
import { Field } from "pixelbits/field";
import { Input } from "pixelbits/input";

<Field label="Email" required>
  <Input type="email" />
</Field>
<Button variant="primary">Subscribe</Button>
```

Prefer to own the code? Every component is also a shadcn registry item:

```sh
npx shadcn add https://pixelbits.ali-moradi-develop.com/r/button.json
```

## License

MIT © Ali Moradi
