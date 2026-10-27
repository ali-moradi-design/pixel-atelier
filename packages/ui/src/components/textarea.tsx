"use client";

import { cx } from "class-variance-authority";
import { forwardRef, type TextareaHTMLAttributes } from "react";
import { fieldControlProps, useField } from "./field.tsx";
import { controlFrame } from "./input.tsx";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Grow with the content (CSS `field-sizing: content`, no JavaScript), between
   * `rows` and `maxRows`.
   * @default false
   */
  autoResize?: boolean;
  /**
   * With `autoResize`, the height stops growing at this many rows and scrolls.
   * @default 12
   */
  maxRows?: number;
}

/**
 * A multi-line text field with the same frame as `Input`. Works inside a
 * `Field` like every kit control.
 *
 * @example
 * ```tsx
 * <Field label="Message">
 *   <Textarea autoResize rows={3} placeholder="Tell us about the project…" />
 * </Field>
 * ```
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { autoResize = false, maxRows = 12, rows = 3, className, style, ...props },
  ref,
) {
  const field = useField();
  return (
    <div className={cx(controlFrame({ size: "none" }), "items-stretch")}>
      <textarea
        ref={ref}
        rows={rows}
        {...props}
        {...fieldControlProps(field, props)}
        style={
          autoResize ? { maxHeight: `calc(${maxRows}lh + 1.25rem)`, ...style } : style
        }
        className={cx(
          "w-full resize-y bg-transparent px-3 py-2.5 leading-normal text-inherit outline-none placeholder:text-pb-muted",
          autoResize && "field-sizing-content resize-none",
          className,
        )}
      />
    </div>
  );
});
