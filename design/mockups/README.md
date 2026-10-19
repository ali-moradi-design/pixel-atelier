# Mockups

Static design mockups, rendered from `mockups.html` (draft tokens, every
component state frozen in one frame). Not library code.

| Page | Dark | Light |
| --- | --- | --- |
| Tokens | `tokens-dark.png` | `tokens-light.png` |
| Core components | `core-dark.png` | `core-light.png` |
| Signature components | `signature-dark.png` | `signature-light.png` |

Open `mockups.html?page=tokens|core|signature&theme=dark|light` in a browser,
or render all PNGs with Playwright:

```sh
node render.mjs "$PWD"        # 1x; pass 2 as the second argument for 2x
```
