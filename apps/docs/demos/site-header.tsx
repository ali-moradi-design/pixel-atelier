import { SiteHeader } from "pixel-atelier/blocks/site-header";
import { Button } from "pixel-atelier/button";

export default function Demo() {
  return (
    <div className="w-full overflow-hidden rounded-pa-md border border-pa-border">
      <SiteHeader
        sticky={false}
        className="border-b-0"
        brand={
          <a href="#home" className="text-sm font-medium">
            pixel <span className="font-light">atelier</span>
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
        menuFooter="hello@pixel-atelier.dev"
      />
    </div>
  );
}
