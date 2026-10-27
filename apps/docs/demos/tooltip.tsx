"use client";
import { IconButton } from "pixelbits/icon-button";
import { Tooltip } from "pixelbits/tooltip";

export default function Demo() {
  return (
    <Tooltip content="Copy to clipboard">
      <IconButton aria-label="Copy">
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
    </Tooltip>
  );
}
