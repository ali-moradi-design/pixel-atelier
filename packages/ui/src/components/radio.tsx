"use client";

import { cx } from "class-variance-authority";
import {
  createContext,
  forwardRef,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  useContext,
  useId,
} from "react";
import { useControllable } from "../lib/use-controllable.ts";

interface RadioGroupState {
  name: string;
  value: string | undefined;
  setValue: (value: string) => void;
  disabled: boolean;
}
const RadioGroupContext = createContext<RadioGroupState | null>(null);

export interface RadioGroupProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  /** The selected value (controlled). */
  value?: string;
  /** The value selected at first (uncontrolled). */
  defaultValue?: string;
  /** Called with the value of the radio the user picked. */
  onValueChange?: (value: string) => void;
  /** Form field name shared by the radios. Generated when omitted. */
  name?: string;
  /**
   * Accessible name of the group, when there is no visible heading linked with
   * `aria-labelledby`.
   */
  "aria-label"?: string;
  /**
   * Disables every radio in the group.
   * @default false
   */
  disabled?: boolean;
  /**
   * Layout of the radios.
   * @default "vertical"
   */
  orientation?: "vertical" | "horizontal";
  /** The `Radio` items. */
  children: ReactNode;
}

/**
 * A set of `Radio` buttons where only one can be selected. Built on native
 * radios, so arrow keys move the selection and forms submit the value.
 *
 * @example
 * ```tsx
 * <RadioGroup aria-label="Billing" defaultValue="monthly">
 *   <Radio value="monthly" label="Monthly" />
 *   <Radio value="yearly" label="Yearly" />
 * </RadioGroup>
 * ```
 */
export function RadioGroup({
  value: valueProp,
  defaultValue,
  onValueChange,
  name: nameProp,
  disabled = false,
  orientation = "vertical",
  className,
  children,
  ...props
}: RadioGroupProps) {
  const auto = useId();
  const [value, setValue] = useControllable<string | undefined>(
    valueProp,
    defaultValue,
    onValueChange as (v: string | undefined) => void,
  );
  return (
    <div
      role="radiogroup"
      aria-orientation={orientation}
      className={cx(
        "flex",
        orientation === "vertical" ? "flex-col gap-2.5" : "flex-wrap gap-5",
        className,
      )}
      {...props}
    >
      <RadioGroupContext.Provider
        value={{
          name: nameProp ?? `pb-radio-${auto}`,
          value,
          setValue: setValue as (v: string) => void,
          disabled,
        }}
      >
        {children}
      </RadioGroupContext.Provider>
    </div>
  );
}

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value"> {
  /** The value this radio stands for. */
  value: string;
  /** Text next to the radio; clicking it selects the radio. */
  label?: ReactNode;
  /** Smaller text under the label. */
  description?: ReactNode;
}

/**
 * One option of a `RadioGroup`: a native radio, styled, with a square pixel
 * dot when selected.
 *
 * @example
 * ```tsx
 * <Radio value="yearly" label="Yearly" description="Two months free" />
 * ```
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { value, label, description, className, disabled, ...props },
  ref,
) {
  const group = useContext(RadioGroupContext);
  const input = (
    <span className="relative inline-grid size-4.5 shrink-0 place-items-center">
      <input
        ref={ref}
        type="radio"
        value={value}
        name={group?.name}
        checked={group ? group.value === value : undefined}
        disabled={disabled ?? group?.disabled}
        onChange={() => group?.setValue(value)}
        {...props}
        className={cx(
          "peer size-full cursor-pointer appearance-none rounded-full border border-pb-border-strong bg-pb-bg outline-none",
          "checked:border-pb-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pb-accent",
          "disabled:cursor-not-allowed disabled:opacity-40",
          className,
        )}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute size-2 scale-0 bg-pb-accent transition-transform duration-pb-fast ease-[steps(2,end)] peer-checked:scale-100"
      />
    </span>
  );
  if (!label) return input;
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: the input is inside `control`
    <label className="inline-flex cursor-pointer items-start gap-2.5 text-sm text-pb-text has-disabled:cursor-not-allowed has-disabled:opacity-60">
      <span className="mt-px">{input}</span>
      <span className="grid gap-0.5">
        <span>{label}</span>
        {description && <span className="text-xs text-pb-muted">{description}</span>}
      </span>
    </label>
  );
});
