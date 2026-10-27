"use client";

import { cx } from "class-variance-authority";
import {
  createContext,
  type HTMLAttributes,
  type ReactNode,
  useContext,
  useId,
} from "react";

interface FieldState {
  id: string;
  describedBy: string | undefined;
  invalid: boolean;
  required: boolean;
  disabled: boolean;
}

const FieldContext = createContext<FieldState | null>(null);

/**
 * The ids and states a control inside a `Field` should use. Returns `null`
 * outside a field. Kit controls read it automatically; use it to wire up
 * your own control.
 */
export function useField() {
  return useContext(FieldContext);
}

export interface FieldProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Visible label, linked to the control with `for`/`id`. */
  label: ReactNode;
  /** Helper text under the control, linked with `aria-describedby`. */
  description?: ReactNode;
  /**
   * Error message. When set, the control is marked `aria-invalid` and the
   * message replaces the description and is announced.
   */
  error?: ReactNode;
  /**
   * Marks the control as required and shows a small accent square after the
   * label.
   * @default false
   */
  required?: boolean;
  /**
   * Disables the control and dims the label.
   * @default false
   */
  disabled?: boolean;
  /**
   * Id of the control. Generated when omitted.
   */
  id?: string;
  /** The control: `Input`, `Textarea`, `Select`, `Combobox`, `Slider`… */
  children: ReactNode;
}

/**
 * Label, control, helper text and error in one, with the accessibility wiring
 * done: the label points at the control, the text is linked with
 * `aria-describedby`, and an error sets `aria-invalid`.
 *
 * @example
 * ```tsx
 * <Field label="Email" description="We never share it." error={errors.email} required>
 *   <Input type="email" name="email" />
 * </Field>
 * ```
 */
export function Field({
  label,
  description,
  error,
  required = false,
  disabled = false,
  id: idProp,
  className,
  children,
  ...props
}: FieldProps) {
  const auto = useId();
  const id = idProp ?? `pb-field-${auto}`;
  const hasError = error != null && error !== false && error !== "";
  const textId = `${id}-text`;
  const showText = hasError || description != null;
  return (
    <div className={cx("grid gap-1.5", className)} {...props}>
      <label
        htmlFor={id}
        className={cx(
          "inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-pb-text",
          disabled && "opacity-50",
        )}
      >
        {label}
        {required && <span aria-hidden="true" className="size-1 bg-pb-accent" />}
      </label>
      <FieldContext.Provider
        value={{
          id,
          describedBy: showText ? textId : undefined,
          invalid: hasError,
          required,
          disabled,
        }}
      >
        {children}
      </FieldContext.Provider>
      {hasError ? (
        <p
          id={textId}
          role="alert"
          className="flex items-center gap-1.5 text-xs text-pb-danger"
        >
          <span aria-hidden="true" className="size-1.5 shrink-0 bg-current" />
          {error}
        </p>
      ) : (
        description != null && (
          <p id={textId} className="text-xs text-pb-muted">
            {description}
          </p>
        )
      )}
    </div>
  );
}

/** Props a control should spread to connect with its `Field`. */
export function fieldControlProps(
  field: FieldState | null,
  own: {
    id?: string;
    "aria-describedby"?: string;
    "aria-invalid"?: unknown;
    required?: boolean;
    disabled?: boolean;
  },
) {
  const describedBy = [own["aria-describedby"], field?.describedBy]
    .filter(Boolean)
    .join(" ");
  return {
    id: own.id ?? field?.id,
    "aria-describedby": describedBy || undefined,
    "aria-invalid":
      (own["aria-invalid"] as boolean | undefined) ?? (field?.invalid || undefined),
    required: own.required ?? (field?.required || undefined),
    disabled: own.disabled ?? (field?.disabled || undefined),
  };
}
