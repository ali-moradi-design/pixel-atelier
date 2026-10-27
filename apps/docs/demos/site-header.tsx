import { SiteHeader } from "pixelbits/blocks/site-header";
import { Button } from "pixelbits/button";

export default function Demo() {
  return (
    <div className="w-full overflow-hidden rounded-pb-md border border-pb-border">
      <SiteHeader
        sticky={false}
        className="border-b-0"
        brand={
          <a href="#home" className="text-sm font-medium">
            pixel<span className="font-light">bits</span>
          </a>
        }
        links={[
          { label: "Work", href: "#work", current: true },
          { label: "Studio", href: "#studio" },
          { label: "Journal", href: "#journal" },
        ]}
        actions={
          <Button size="sm" variant="primary">
            Contact
          </Button>
        }
        menuFooter="hello@pixelbits.dev"
      />
    </div>
  );
}
