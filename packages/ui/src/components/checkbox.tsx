"use client";

import { cx } from "class-variance-authority";
import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  useEffect,
  useId,
  useRef,
} from "react";
import { CheckIcon } from "../lib/icons.tsx";
import { composeRefs } from "../lib/slot.tsx";
import { fieldControlProps, useField } from "./field.tsx";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "children"> {
  /** Text next to the box; clicking it toggles the box. */
  label?: ReactNode;
  /** Smaller text under the label, linked with `aria-describedby`. */
  description?: ReactNode;
  /**
   * The mixed state (a dash), for a "select all" box whose children are only
   * partly checked. Screen readers announce it as "mixed".
   * @default false
   */
  indeterminate?: boolean;
  /**
   * Called with the new checked state. The native `onChange` still works too.
   */
  onCheckedChange?: (checked: boolean) => void;
}

/**
 * A native checkbox, styled: it stays a real `<input type="checkbox">`, so
 * forms, keyboard and screen readers work without JavaScript. When checked,
 * the box fills in three pixel steps.
 *
 * Controlled with `checked` + `onCheckedChange`, or uncontrolled with
 * `defaultChecked`.
 *
 * @example
 * ```tsx
 * <Checkbox label="Email notifications" defaultChecked />
 * <Checkbox label="Select all" indeterminate={some && !all} checked={all} onCheckedChange={toggleAll} />
 * ```
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    label,
    description,
    indeterminate = false,
    onCheckedChange,
    onChange,
    className,
    ...props
  },
  ref,
) {
  const inner = useRef<HTMLInputElement>(null);
  const field = useField();
  const descId = useId();
  useEffect(() => {
    if (inner.current) inner.current.indeterminate = indeterminate;
  }, [indeterminate]);
  const control = (
    <span className="relative inline-grid size-4.5 shrink-0 place-items-center">
      <input
        ref={composeRefs(ref, inner)}
        type="checkbox"
        {...props}
        {...(label ? {} : fieldControlProps(field, props))}
        aria-describedby={description ? descId : props["aria-describedby"]}
        onChange={(e) => {
          onChange?.(e);
          onCheckedChange?.(e.currentTarget.checked);
        }}
        className={cx(
          "peer pb-check size-full cursor-pointer appearance-none rounded-[3px] border border-pb-border-strong bg-pb-bg outline-none",
          "checked:border-transparent indeterminate:border-transparent",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pb-accent",
          "disabled:cursor-not-allowed disabled:opacity-40 aria-invalid:border-pb-danger",
          className,
        )}
      />
      <CheckIcon
        strokeWidth={2.2}
        className="pointer-events-none absolute size-3.5 text-pb-on-accent opacity-0 peer-checked:opacity-100 peer-indeterminate:opacity-0"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute h-0.5 w-2 bg-pb-on-accent opacity-0 peer-indeterminate:opacity-100"
      />
    </span>
  );
  if (!label) return control;
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: the input is inside `control`
    <label className="inline-flex cursor-pointer items-start gap-2.5 text-sm text-pb-text has-disabled:cursor-not-allowed has-disabled:opacity-60">
      <span className="mt-px">{control}</span>
      <span className="grid gap-0.5">
        <span>{label}</span>
        {description && (
          <span id={descId} className="text-xs text-pb-muted">
            {description}
          </span>
        )}
      </span>
    </label>
  );
});
