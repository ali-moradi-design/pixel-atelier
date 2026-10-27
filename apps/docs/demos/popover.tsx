"use client";
import { Button } from "pixelbits/button";
import { Input } from "pixelbits/input";
import { Popover } from "pixelbits/popover";

export default function Demo() {
  return (
    <Popover trigger={<Button>Share</Button>} title="Share link">
      <p className="mb-2.5 text-pb-muted">Anyone with the link can view.</p>
      <Input readOnly value="pb.dev/s/9x2" size="sm" aria-label="Link" />
    </Popover>
  );
}
