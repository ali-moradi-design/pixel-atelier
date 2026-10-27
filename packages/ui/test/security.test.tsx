import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FeatureGrid } from "../src/blocks/feature-grid.tsx";
import { Hero } from "../src/blocks/hero.tsx";
import { Pricing } from "../src/blocks/pricing.tsx";
import { SiteFooter } from "../src/blocks/site-footer.tsx";
import { SiteHeader } from "../src/blocks/site-header.tsx";
import { Avatar } from "../src/components/avatar.tsx";
import { Badge } from "../src/components/badge.tsx";
import { Breadcrumb } from "../src/components/breadcrumb.tsx";
import { Card } from "../src/components/card.tsx";
import { Combobox } from "../src/components/combobox.tsx";
import { CommandPalette } from "../src/components/command-palette.tsx";
import { Dialog } from "../src/components/dialog.tsx";
import { Field } from "../src/components/field.tsx";
import { FullScreenMenu } from "../src/components/full-screen-menu.tsx";
import { Input } from "../src/components/input.tsx";
import { Pagination } from "../src/components/pagination.tsx";
import { Select } from "../src/components/select.tsx";
import { Tag } from "../src/components/tag.tsx";
import { TextLink } from "../src/components/text-link.tsx";
import { TextScramble } from "../src/components/text-scramble.tsx";
import { dismissToast, Toaster, toast } from "../src/components/toast.tsx";

// Untrusted text (from a CMS, a URL, a user) must only ever render as text,
// and untrusted links must never run script. These are the classic payloads.
const XSS = [
  `<script>window.__pwned = 1</script>`,
  `<img src=x onerror="window.__pwned=1">`,
  `"><svg onload="window.__pwned=1">`,
  `javascript:window.__pwned=1`,
  `{{constructor.constructor('window.__pwned=1')()}}`,
  `<a href="javascript:window.__pwned=1">x</a>`,
  `‮<b>rtl override</b>`,
];
const JS_URL = "javascript:window.__pwned=1";

declare global {
  interface Window {
    __pwned?: number;
  }
}

beforeAll(() => {
  window.matchMedia ??= ((q: string) => ({
    matches: false,
    media: q,
    addEventListener() {},
    removeEventListener() {},
  })) as never;
});
afterEach(() => {
  expect(window.__pwned).toBeUndefined();
  act(() => dismissToast());
});

/** No element or attribute that came from the payloads may exist in the DOM. */
function expectInert(root: ParentNode) {
  expect(root.querySelector("script")).toBeNull();
  expect(root.querySelector("img[src='x'], svg[onload]")).toBeNull();
  for (const el of root.querySelectorAll("*")) {
    for (const attr of el.attributes) {
      expect(attr.name.startsWith("on"), `${el.tagName} has ${attr.name}`).toBe(false);
      if (["href", "src", "action", "formaction", "xlink:href"].includes(attr.name)) {
        expect(attr.value, `${el.tagName}[${attr.name}]`).not.toMatch(/__pwned/);
      }
    }
  }
}

describe.each(XSS)("payload %s", (payload) => {
  it("renders as text in text props of every component", async () => {
    const { container } = render(
      <div>
        <Badge>{payload}</Badge>
        <Tag onRemove={() => {}}>{payload}</Tag>
        <Card eyebrow={payload} title={payload} description={payload} footer={payload} />
        <Avatar name={payload} fallback="initials" />
        <Avatar name={payload} />
        <Field label={payload} description={payload} error={payload}>
          <Input placeholder={payload} defaultValue={payload} />
        </Field>
        <Breadcrumb items={[{ label: payload, href: "/a" }, { label: payload }]} />
        <Hero eyebrow={payload} title={payload} description={payload} scramble />
        <FeatureGrid
          title={payload}
          features={[{ title: payload, description: payload }]}
        />
        <Pricing
          plans={[
            {
              name: payload,
              price: payload,
              description: payload,
              features: [payload],
              cta: { label: payload },
            },
          ]}
        />
        <SiteFooter
          tagline={payload}
          columns={[{ title: payload, links: [{ label: payload, href: "/x" }] }]}
          legal={payload}
        />
        <TextScramble text={payload} />
        <Dialog defaultOpen title={payload} description={payload}>
          {payload}
        </Dialog>
      </div>,
    );
    expect(container.textContent).toContain(
      payload.replace(/\s+/g, " ").slice(0, 10).trim().slice(0, 4),
    );
    expectInert(container);
  });

  it("stays text in listbox options, matches and toasts", async () => {
    render(
      <>
        <Select
          aria-label="s"
          options={[{ value: "a", label: payload, description: payload }]}
        />
        <Combobox aria-label="c" options={[{ value: "a", label: payload }]} />
        <Toaster />
      </>,
    );
    await userEvent.click(screen.getByRole("combobox", { name: "s" }));
    const query = payload.slice(0, 6);
    await userEvent.type(
      screen.getByRole("combobox", { name: "c" }),
      query.replace(/[{[]/g, (m) => m + m),
    );
    act(() => {
      toast({
        title: payload,
        description: payload,
        action: { label: payload, onClick: () => {} },
      });
    });
    expectInert(document.body);
  });
});

describe("links", () => {
  it("never render a working javascript: URL (React 19 blocks them)", () => {
    const { container } = render(
      <div>
        <TextLink href={JS_URL}>a</TextLink>
        <Breadcrumb items={[{ label: "x", href: JS_URL }, { label: "y" }]} />
        <Pagination page={1} count={3} href={() => JS_URL} />
        <SiteHeader brand="b" links={[{ label: "w", href: JS_URL }]} />
        <SiteFooter columns={[{ title: "t", links: [{ label: "l", href: JS_URL }] }]} />
        <FullScreenMenu
          defaultOpen
          trigger={<button type="button">m</button>}
          links={[{ label: "w", href: JS_URL }]}
        />
      </div>,
    );
    expectInert(container);
  });

  it("does not build HTML from search text (regex and markup characters are safe)", async () => {
    render(
      <CommandPalette
        defaultOpen
        hotkey={false}
        commands={[{ id: "1", label: "<b>bold</b> (group) [x] .*", onSelect: () => {} }]}
      />,
    );
    await userEvent.type(screen.getByRole("combobox"), "(group) [x] .*");
    expect(screen.getAllByRole("option")).toHaveLength(1);
    expectInert(document.body);
  });
});
