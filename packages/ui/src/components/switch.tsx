"use client";

import { cx } from "class-variance-authority";
import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { fieldControlProps, useField } from "./field.tsx";

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "children"> {
  /** Text next to the switch; clicking it toggles the switch. */
  label?: ReactNode;
  /** Called with the new on/off state. The native `onChange` still works too. */
  onCheckedChange?: (checked: boolean) => void;
  /**
   * Size of the track: `"sm"` 32 x 18 px, `"md"` 40 x 22 px.
   * @default "md"
   */
  size?: "sm" | "md";
}

/**
 * An on/off switch for settings that apply at once. It is a native checkbox
 * with `role="switch"`; the square thumb moves in pixel steps.
 *
 * @example
 * ```tsx
 * <Switch label="Reduced motion" checked={reduced} onCheckedChange={setReduced} />
 * ```
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, onCheckedChange, onChange, size = "md", className, ...props },
  ref,
) {
  const field = useField();
  const sm = size === "sm";
  const control = (
    <span
      className={cx(
        "relative inline-flex shrink-0",
        sm ? "h-[1.125rem] w-8" : "h-[1.375rem] w-10",
      )}
    >
      <input
        ref={ref}
        type="checkbox"
        // biome-ignore lint/a11y/useAriaPropsForRole: a native checkbox exposes its checked state to the switch role
        role="switch"
        {...props}
        {...(label ? {} : fieldControlProps(field, props))}
        onChange={(e) => {
          onChange?.(e);
          onCheckedChange?.(e.currentTarget.checked);
        }}
        className={cx(
          "peer absolute inset-0 size-full cursor-pointer appearance-none rounded-pb-xs bg-pb-border-strong outline-none",
          "transition-colors duration-pb-fast checked:bg-pb-accent",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pb-accent",
          "disabled:cursor-not-allowed disabled:opacity-40",
          className,
        )}
      />
      <span
        aria-hidden="true"
        className={cx(
          "pointer-events-none absolute top-[3px] start-[3px] rounded-[1px] bg-pb-text",
          "transition-transform duration-pb-base [transition-timing-function:steps(4,end)]",
          "peer-checked:bg-pb-on-accent rtl:peer-checked:-translate-x-[var(--pb-switch-travel)] ltr:peer-checked:translate-x-[var(--pb-switch-travel)]",
          sm ? "size-3 [--pb-switch-travel:14px]" : "size-4 [--pb-switch-travel:18px]",
        )}
      />
    </span>
  );
  if (!label) return control;
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: the input is inside `control`
    <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm text-pb-text has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60">
      {control}
      {label}
    </label>
  );
});
