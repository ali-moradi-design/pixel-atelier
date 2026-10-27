"use client";
import { IconButton } from "pixelbits/icon-button";

const Plus = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export default function Demo() {
  return (
    <div className="flex items-center gap-3">
      <IconButton aria-label="Add" size="sm">
        <Plus />
      </IconButton>
      <IconButton aria-label="Add">
        <Plus />
      </IconButton>
      <IconButton aria-label="Add" size="lg" variant="primary">
        <Plus />
      </IconButton>
    </div>
  );
}
