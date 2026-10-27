"use client";
import { Button } from "pixelbits/button";
import { FullScreenMenu } from "pixelbits/full-screen-menu";

export default function Demo() {
  return (
    <FullScreenMenu
      trigger={<Button>Open menu</Button>}
      brand={
        <span className="text-sm font-medium">
          pixel<span className="font-light">bits</span>
        </span>
      }
      links={[
        { label: "Work", href: "#work", description: "Selected projects" },
        { label: "Studio", href: "#studio" },
        { label: "Journal", href: "#journal" },
        { label: "Contact", href: "#contact" },
      ]}
      footer="hello@pixelbits.dev"
    />
  );
}
