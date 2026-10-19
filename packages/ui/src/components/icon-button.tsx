import { forwardRef } from "react";
import { Button, type ButtonProps } from "./button.tsx";

export interface IconButtonProps extends Omit<ButtonProps, "size"> {
  /**
   * Square size: `"sm"` 32 px, `"md"` 40 px, `"lg"` 48 px.
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /**
   * Accessible name, read by screen readers. Required: an icon alone has
   * no text, e.g. `aria-label="Close"`.
   */
  "aria-label": string;
}

/**
 * A square button for a single icon, with the same variants and pixel
 * dissolve as `Button`. Pass the icon (any SVG, e.g. from lucide-react) as
 * the child; it is sized to the text.
 *
 * @example
 * ```tsx
 * <IconButton aria-label="Close" variant="ghost" onClick={close}>
 *   <XIcon />
 * </IconButton>
 * ```
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ size = "md", ...props }, ref) {
    const s = size === "md" ? "icon" : size === "sm" ? "icon-sm" : "icon-lg";
    return <Button ref={ref} size={s} {...props} />;
  },
);
