import { cva, cx } from "class-variance-authority";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { Slot, Slottable } from "../lib/slot.tsx";
import { PixelSpinner } from "../pixels/PixelSpinner.tsx";
import { Pixels } from "../pixels/Pixels.tsx";

/**
 * The class names of `Button` for a given variant, for styling other
 * elements the same way, e.g. `className={buttonVariants({ variant: "primary" })}`.
 * Note that the pixel effect of a button also needs the `pa-px-host` class and `<Pixels />`.
 */
export const buttonVariants = cva(
  [
    "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap select-none",
    "rounded-pa-xs border font-pa-sans font-medium uppercase leading-none tracking-[0.06em] no-underline",
    "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pa-accent",
    "disabled:cursor-not-allowed disabled:opacity-40 aria-disabled:cursor-not-allowed aria-disabled:opacity-40",
    "[&_svg]:size-[1.15em] [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary: "border-transparent bg-pa-accent text-pa-on-accent",
        secondary: "border-pa-border-strong bg-transparent text-pa-text",
        ghost:
          "border-transparent text-pa-text [--px-fill:var(--pa-raised)] [--px-ink:var(--pa-text)]",
        danger:
          "border-pa-danger/40 bg-transparent text-pa-danger [--px-fill:var(--pa-danger)]",
      },
      size: {
        sm: "h-8 px-3 text-[0.6875rem]",
        md: "h-10 px-[1.125rem] text-xs",
        lg: "h-12 px-6 text-[0.8125rem]",
        "icon-sm": "size-8 p-0 text-xs",
        icon: "size-10 p-0 text-xs",
        "icon-lg": "size-12 p-0 text-sm",
      },
    },
    defaultVariants: { variant: "secondary", size: "md" },
  },
);

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg" | "icon-sm" | "icon" | "icon-lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual style.
   * - `"primary"`: accent fill, for the one main action of a view.
   * - `"secondary"`: hairline border, for most actions.
   * - `"ghost"`: no border, for toolbars and dense rows.
   * - `"danger"`: red, for destructive actions.
   * @default "secondary"
   */
  variant?: ButtonVariant;
  /**
   * Height and padding.
   * - `"sm"` 32 px, `"md"` 40 px, `"lg"` 48 px.
   * - `"icon-sm"`, `"icon"`, `"icon-lg"`: square 32 / 40 / 48 px for a single
   *   icon (prefer `IconButton`, which also requires an `aria-label`).
   * @default "md"
   */
  size?: ButtonSize;
  /**
   * Render the only child element instead of a `<button>`, merging the
   * button's classes, props and ref into it. Use it for links:
   * `<Button asChild><a href="/start">Start</a></Button>`.
   * @default false
   */
  asChild?: boolean;
  /**
   * The pixel dissolve on hover and keyboard focus. Set `false` for a plain
   * button with a simple background change.
   * @default true
   */
  pixel?: boolean;
  /**
   * Shows a pixel spinner before the label, sets `aria-busy` and disables the
   * button so it cannot be pressed twice.
   * @default false
   */
  loading?: boolean;
}

/**
 * The kit's signature button: on hover or keyboard focus a grid of squares
 * dissolves in behind the label, then the label switches to the ink color.
 * The squares are created on the first interaction only.
 *
 * Renders a `<button type="button">` unless `asChild` is set. All native
 * button props (`onClick`, `disabled`, `type`, `form`…) are passed through.
 *
 * @example
 * ```tsx
 * <Button variant="primary" onClick={save}>Save</Button>
 * <Button loading>Saving</Button>
 * <Button asChild><a href="/docs">Read the docs</a></Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant,
    size,
    asChild = false,
    pixel = true,
    loading = false,
    disabled,
    children,
    type,
    ...props
  },
  ref,
) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      ref={ref}
      className={cx(
        buttonVariants({ variant, size }),
        pixel ? "pa-px-host" : "transition-colors duration-pa-fast hover:bg-pa-raised",
        className,
      )}
      {...(asChild ? {} : { type: type ?? "button", disabled: disabled || loading })}
      aria-busy={loading || undefined}
      {...props}
    >
      {pixel && <Pixels />}
      {loading && <PixelSpinner label="Loading" />}
      <Slottable>{children}</Slottable>
    </Comp>
  );
});
