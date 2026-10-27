import type { HTMLAttributes } from "react";

export interface PixelSpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Accessible name announced by screen readers (`role="status"`).
   * @default "Loading"
   */
  label?: string;
}

/**
 * A 3 x 3 pixel loader: a short trail of squares chases around the edge.
 * CSS only, sized by the font size and colored by `currentColor`.
 *
 * @example
 * ```tsx
 * <PixelSpinner label="Uploading" className="text-pb-accent" />
 * ```
 */
export function PixelSpinner({
  label = "Loading",
  className,
  ...props
}: PixelSpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={`pb-spinner ${className ?? ""}`}
      {...props}
    >
      {[0, 1, 2, 5, 8, 7, 6, 3].map((cell, i) => (
        <i
          key={cell}
          style={{
            gridArea: `${Math.floor(cell / 3) + 1} / ${(cell % 3) + 1}`,
            animationDelay: `${i * 100 - 800}ms`,
          }}
        />
      ))}
    </span>
  );
}
