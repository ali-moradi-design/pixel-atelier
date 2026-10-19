"use client";

import { cx } from "class-variance-authority";
import { type CSSProperties, forwardRef, type InputHTMLAttributes } from "react";
import { useControllable } from "../lib/use-controllable.ts";
import { fieldControlProps, useField } from "./field.tsx";

export interface SliderProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "value" | "defaultValue" | "min" | "max" | "step"
  > {
  /** The current value (controlled). */
  value?: number;
  /**
   * The value at first (uncontrolled).
   * @default min
   */
  defaultValue?: number;
  /** Called with the new value while the user drags or uses the keys. */
  onValueChange?: (value: number) => void;
  /**
   * Lowest value.
   * @default 0
   */
  min?: number;
  /**
   * Highest value.
   * @default 100
   */
  max?: number;
  /**
   * Distance between values; arrow keys move by one step.
   * @default 1
   */
  step?: number;
  /**
   * Draw a small tick for every step (keep the number of steps low).
   * @default false
   */
  ticks?: boolean;
}

/**
 * A single-value slider. A native `<input type="range">`, styled, so keyboard
 * (arrows, Page Up/Down, Home/End), touch, forms and screen readers work out
 * of the box. Give it a name with `Field`, `aria-label` or `aria-labelledby`.
 *
 * @example
 * ```tsx
 * <Field label="Pixel size">
 *   <Slider min={4} max={16} defaultValue={9} onValueChange={setSize} />
 * </Field>
 * ```
 */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  {
    value: valueProp,
    defaultValue,
    onValueChange,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    ticks = false,
    className,
    style,
    ...props
  },
  ref,
) {
  const field = useField();
  const [value, setValue] = useControllable(
    valueProp,
    defaultValue ?? min,
    onValueChange,
  );
  const pct = max > min ? ((value - min) / (max - min)) * 100 : 0;
  const steps = ticks ? Math.round((max - min) / step) : 0;
  return (
    <input
      ref={ref}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      {...props}
      {...fieldControlProps(field, props)}
      onChange={(e) => {
        onChange?.(e);
        setValue(Number(e.currentTarget.value));
      }}
      style={
        {
          "--pa-fill": `${pct}%`,
          "--pa-ticks": steps || undefined,
          ...style,
        } as CSSProperties
      }
      className={cx("pa-slider", ticks && "pa-slider-ticks", className)}
    />
  );
});
