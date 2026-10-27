import { SiteFooter } from "pixelbits/blocks/site-footer";

export default function Demo() {
  return (
    <div className="w-full overflow-hidden rounded-pb-md border border-pb-border">
      <SiteFooter
        className="border-t-0"
        brand={
          <span className="text-sm font-medium">
            pixel<span className="font-light">bits</span>
          </span>
        }
        tagline="Pixels, crafted with care."
        columns={[
          {
            title: "Kit",
            links: [
              { label: "Docs", href: "#docs" },
              { label: "Components", href: "#components" },
            ],
          },
          {
            title: "Studio",
            links: [
              { label: "About", href: "#about" },
              { label: "Contact", href: "#contact" },
            ],
          },
        ]}
        legal="© 2026 Ali Moradi · MIT"
      />
    </div>
  );
}
