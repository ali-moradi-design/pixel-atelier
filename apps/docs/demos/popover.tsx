"use client";
import { Button } from "pixel-atelier/button";
import { Input } from "pixel-atelier/input";
import { Popover } from "pixel-atelier/popover";

export default function Demo() {
  return (
    <Popover trigger={<Button>Share</Button>} title="Share link">
      <p className="mb-2.5 text-pa-muted">Anyone with the link can view.</p>
      <Input readOnly value="pa.dev/s/9x2" size="sm" aria-label="Link" />
    </Popover>
  );
}
