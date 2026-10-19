"use client";
import { Button } from "pixel-atelier/button";
import { CommandPalette } from "pixel-atelier/command-palette";
import { toast } from "pixel-atelier/toast";
import { useState } from "react";

export default function Demo() {
  const [open, setOpen] = useState(false);
  const run = (label: string) => () => toast({ title: label });
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open palette</Button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        hotkey={false}
        commands={[
          {
            id: "1",
            label: "Pixel button",
            group: "Components",
            onSelect: run("Pixel button"),
          },
          {
            id: "2",
            label: "Pixel image reveal",
            group: "Components",
            onSelect: run("Image reveal"),
          },
          {
            id: "3",
            label: "Copy install command",
            group: "Actions",
            shortcut: "⌘ C",
            onSelect: run("Copied"),
          },
        ]}
      />
    </>
  );
}
