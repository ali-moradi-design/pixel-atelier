"use client";

import { cva, cx } from "class-variance-authority";
import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { fieldControlProps, useField } from "./field.tsx";

/**
 * The frame shared by `Input`, `Textarea`, `Select` and `Combobox`: hairline
 * border, accent focus ring, a bottom hairline that fills in pixel steps on
 * focus, and the invalid state.
 */
export const controlFrame = cva(
  [
    "pb-control group/control relative flex w-full items-center gap-2 rounded-pb-sm border bg-pb-bg text-pb-text",
    "border-pb-border-strong transition-[border-color,box-shadow] duration-pb-fast",
    "focus-within:border-pb-accent focus-within:shadow-[0_0_0_3px_var(--pb-accent-subtle)]",
    "has-aria-invalid:border-pb-danger has-disabled:opacity-50",
    "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-pb-muted",
  ],
  {
    variants: {
      size: {
        sm: "h-8 px-2.5 text-[0.8125rem]",
        md: "h-10 px-3 text-sm",
        lg: "h-12 px-3.5 text-base",
        /** No height or padding (Textarea sets its own). */
        none: "text-sm",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /**
   * Height: `"sm"` 32 px, `"md"` 40 px, `"lg"` 48 px.
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /** Content before the text, usually an icon (e.g. a search glass). */
  start?: ReactNode;
  /** Content after the text: an icon, a unit, a `kbd` hint or a small button. */
  end?: ReactNode;
  /** Classes for the outer frame (the `className` prop goes to the `<input>`). */
  frameClassName?: string;
}

/**
 * A single-line text field. Inside a `Field` it picks up its id, label,
 * description and error automatically. All native input props are passed to
 * the `<input>`; the ref points at it too.
 *
 * @example
 * ```tsx
 * <Field label="Search">
 *   <Input start={<SearchIcon />} end={<kbd>⌘K</kbd>} placeholder="Search components" />
 * </Field>
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size, start, end, className, frameClassName, ...props },
  ref,
) {
  const field = useField();
  return (
    <div className={cx(controlFrame({ size }), frameClassName)}>
      {start}
      <input
        ref={ref}
        {...props}
        {...fieldControlProps(field, props)}
        className={cx(
          "h-full min-w-0 flex-1 bg-transparent text-inherit outline-none placeholder:text-pb-muted disabled:cursor-not-allowed",
          className,
        )}
      />
      {end && <span className="ms-auto flex items-center text-pb-muted">{end}</span>}
    </div>
  );
});
