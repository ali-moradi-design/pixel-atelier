import { badgeVariants } from "../src/components/badge.tsx";
import { buttonVariants } from "../src/components/button.tsx";
import { controlFrame } from "../src/components/input.tsx";
import { textLinkVariants } from "../src/components/text-link.tsx";

// The kit does not ship tailwind-merge, so a component must never emit two
// utilities that set the same property (their order in the CSS would decide).
// This checks every variant combination for the families that clash in practice.
const families: [string, RegExp][] = [
  ["background", /^bg-/],
  ["text color", /^text-(pb-|inherit$|current$|transparent$)/],
  ["font size", /^text-(xs|sm|base|lg|xl|\d?xl|\[[\d.]+(rem|px)\])$/],
  ["height", /^h-/],
  ["size", /^size-/],
  ["inline padding", /^(px|p)-/],
  ["radius", /^rounded-/],
  ["border color", /^border-(pb-|transparent$)/],
];

function conflicts(className: string) {
  const plain = className.split(/\s+/).filter((c) => c && !c.includes(":"));
  return families.flatMap(([name, re]) => {
    const hits = plain.filter((c) => re.test(c));
    return hits.length > 1 ? [`${name}: ${hits.join(" ")}`] : [];
  });
}

function combos(variants: Record<string, string[]>) {
  return Object.entries(variants).reduce<Record<string, string>[]>(
    (acc, [key, values]) => acc.flatMap((c) => values.map((v) => ({ ...c, [key]: v }))),
    [{}],
  );
}

it.each([
  [
    "Button",
    buttonVariants,
    {
      variant: ["primary", "secondary", "outline", "ghost", "danger"],
      size: ["sm", "md", "lg", "icon-sm", "icon", "icon-lg"],
    },
  ],
  [
    "Badge",
    badgeVariants,
    { variant: ["neutral", "accent", "success", "warning", "danger", "info", "solid"] },
  ],
  ["TextLink", textLinkVariants, { variant: ["underline", "pixel", "plain"] }],
  ["control frame", controlFrame, { size: ["sm", "md", "lg", "none"] }],
] as const)("%s variants never emit conflicting utilities", (_, fn, variants) => {
  for (const c of combos(variants as unknown as Record<string, string[]>)) {
    expect(conflicts((fn as (p: object) => string)(c)), JSON.stringify(c)).toEqual([]);
  }
});
