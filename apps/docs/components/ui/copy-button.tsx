"use client";

import { IconButton } from "pixelbits/icon-button";
import { toast } from "pixelbits/toast";

/** A small button that copies text and confirms with a toast. */
export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  return (
    <IconButton
      aria-label={label}
      variant="ghost"
      size="sm"
      onClick={async () => {
        await navigator.clipboard?.writeText(text);
        toast({
          title: "Copied to clipboard",
          description: text.length < 60 ? text : undefined,
          variant: "success",
          duration: 2500,
        });
      }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path d="M8 8h12v12H8zM16 8V4H4v12h4" />
      </svg>
    </IconButton>
  );
}
