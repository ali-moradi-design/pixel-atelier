"use client";
import { Button } from "pixelbits/button";
import { pixelTransition } from "pixelbits/page-transition";

// <PixelTransition /> is mounted once in this site's layout.
export default function Demo() {
  return (
    <Button
      variant="primary"
      onClick={() => pixelTransition(() => new Promise((r) => setTimeout(r, 300)))}
    >
      Run a page transition
    </Button>
  );
}
