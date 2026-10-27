import type { ReactNode } from "react";

/**
 * A label that rolls up when its host (`pb-px-host` or `pb-roll-host`) is
 * active, while a copy comes in from below. The copy is hidden from assistive
 * technology.
 *
 * @example
 * ```tsx
 * <a className="pb-roll-host" href="/studio"><RollLabel>Studio</RollLabel></a>
 * ```
 */
export function RollLabel({
  children,
}: {
  /** The label; rendered twice (the copy is `aria-hidden`). */
  children: ReactNode;
}) {
  return (
    <span className="pb-roll">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  );
}
