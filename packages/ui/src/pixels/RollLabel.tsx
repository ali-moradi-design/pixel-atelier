import type { ReactNode } from "react";

/**
 * A label that rolls up when its host (`pa-px-host` or `pa-roll-host`) is
 * active, while a copy comes in from below. The copy is hidden from assistive
 * technology.
 *
 * @example
 * ```tsx
 * <a className="pa-roll-host" href="/studio"><RollLabel>Studio</RollLabel></a>
 * ```
 */
export function RollLabel({
  children,
}: {
  /** The label; rendered twice (the copy is `aria-hidden`). */
  children: ReactNode;
}) {
  return (
    <span className="pa-roll">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  );
}
