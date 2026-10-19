import { cx } from "class-variance-authority";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** Current value between 0 and `max`. Omit for an indeterminate bar. */
  value?: number;
  /**
   * The value that means done.
   * @default 100
   */
  max?: number;
  /**
   * - `"bar"`: a thin continuous bar.
   * - `"pixel"`: a row of squares that light up, with a few flickering at the edge.
   * @default "bar"
   */
  variant?: "bar" | "pixel";
  /**
   * Number of squares for the `"pixel"` variant.
   * @default 40
   */
  segments?: number;
  /** Visible label above the bar; also its accessible name. */
  label?: ReactNode;
  /**
   * Show the value (as a percent) next to the label.
   * @default true
   */
  showValue?: boolean;
  /**
   * Accessible name when there is no visible `label`.
   */
  "aria-label"?: string;
}

/**
 * Shows how far a task has come. `role="progressbar"` with the value exposed
 * to screen readers; without a value it is indeterminate (a pixel band
 * sweeps across). CSS only.
 *
 * @example
 * ```tsx
 * <Progress label="Uploading assets" value={64} />
 * <Progress label="Building registry" value={26} max={40} variant="pixel" />
 * ```
 */
export function Progress({
  value,
  max = 100,
  variant = "bar",
  segments = 40,
  label,
  showValue = true,
  className,
  ...props
}: ProgressProps) {
  const determinate = typeof value === "number";
  const ratio = determinate ? Math.min(1, Math.max(0, value / max)) : 0;
  const pct = Math.round(ratio * 100);
  const lit = Math.round(ratio * segments);
  const id = props.id ?? undefined;
  return (
    <div className={cx("grid gap-1.5", className)}>
      {label && (
        <div className="flex items-baseline justify-between gap-3 text-[0.8125rem] text-pa-text">
          <span>{label}</span>
          {showValue && determinate && (
            <span className="font-pa-mono text-xs text-pa-muted tabular-nums">
              {pct}%
            </span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-label={typeof label === "string" ? label : props["aria-label"]}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={determinate ? value : undefined}
        id={id}
        {...props}
        className={cx(
          "relative overflow-hidden",
          variant === "bar" ? "h-1.5 bg-pa-border" : "grid h-2 gap-0.5",
          !determinate && "pa-progress-indeterminate",
        )}
        style={
          variant === "pixel"
            ? ({ gridTemplateColumns: `repeat(${segments}, 1fr)` } as CSSProperties)
            : undefined
        }
      >
        {variant === "bar"
          ? determinate && (
              <span
                className="absolute inset-y-0 start-0 bg-pa-accent transition-[width] duration-pa-slow ease-pa-out"
                style={{ width: `${pct}%` }}
              />
            )
          : Array.from({ length: segments }, (_, i) => (
              <i
                // biome-ignore lint/suspicious/noArrayIndexKey: segments never reorder
                key={i}
                className={cx(
                  "block",
                  determinate && i < lit ? "bg-pa-accent" : "bg-pa-border",
                  determinate && i >= lit && i < lit + 3 && "pa-progress-edge",
                )}
                style={
                  determinate && i >= lit && i < lit + 3
                    ? ({ animationDelay: `${(i - lit) * 160}ms` } as CSSProperties)
                    : undefined
                }
              />
            ))}
      </div>
    </div>
  );
}
