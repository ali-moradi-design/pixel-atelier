"use client";

import { cx } from "class-variance-authority";
import { type ReactElement, type ReactNode, useEffect, useRef } from "react";
import { XIcon } from "../lib/icons.tsx";
import { Slot } from "../lib/slot.tsx";
import { useControllable } from "../lib/use-controllable.ts";
import { Pixels } from "../pixels/Pixels.tsx";
import { RollLabel } from "../pixels/RollLabel.tsx";

/** One destination of a `FullScreenMenu`. */
export interface MenuLink {
  /** Visible label (large). */
  label: string;
  /** Link target. */
  href: string;
  /** Small text under the label. */
  description?: string;
  /** Marks the link as the current page (`aria-current="page"`). */
  current?: boolean;
}

export interface FullScreenMenuProps {
  /** The destinations, shown as large cells in a grid. */
  links: MenuLink[];
  /** The element that opens the menu, usually a `Button` ("Menu"). */
  trigger: ReactElement;
  /** Whether it is open (controlled). */
  open?: boolean;
  /**
   * Open on first render (uncontrolled).
   * @default false
   */
  defaultOpen?: boolean;
  /** Called when it opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Content of the top bar on the start side, usually the logo. */
  brand?: ReactNode;
  /** Content under the grid: contact details, social links. */
  footer?: ReactNode;
  /**
   * Cells per row on wide screens (one per row on phones).
   * @default 2
   */
  columns?: 1 | 2 | 3;
  /**
   * Render links with your router's component, e.g.
   * `(link, props) => <NextLink href={link.href} {...props} />`.
   */
  renderLink?: (
    link: MenuLink,
    props: { className: string; children: ReactNode; onClick: () => void },
  ) => ReactNode;
  /**
   * Accessible name of the menu dialog.
   * @default "Menu"
   */
  label?: string;
}

/**
 * The portfolio's full-screen menu: a modal of large cells; hovering or
 * focusing a cell dissolves it to the ink color while its label rolls up.
 * Built on a native `<dialog>` (focus trap, Escape, top layer), with links
 * inside a `<nav>`.
 *
 * @example
 * ```tsx
 * <FullScreenMenu
 *   trigger={<Button size="sm">Menu</Button>}
 *   brand={<Logo />}
 *   links={[{ label: "Work", href: "/work" }, { label: "Studio", href: "/studio" }]}
 * />
 * ```
 */
export function FullScreenMenu({
  links,
  trigger,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  brand,
  footer,
  columns = 2,
  renderLink,
  label = "Menu",
}: FullScreenMenuProps) {
  const [open, setOpen] = useControllable(openProp, defaultOpen, onOpenChange);
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open)
      typeof d.showModal === "function" ? d.showModal() : d.setAttribute("open", "");
    else if (!open && d.open)
      typeof d.close === "function" ? d.close() : d.removeAttribute("open");
  }, [open]);
  const close = () => setOpen(false);
  const cols =
    columns === 1
      ? ""
      : columns === 2
        ? "sm:grid-cols-2"
        : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <>
      <Slot aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>
        {trigger}
      </Slot>
      <dialog
        ref={ref}
        aria-label={label}
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClose={() => open && close()}
        className="pb-dialog pb-menu m-0 size-full max-h-none max-w-none bg-pb-bg p-0 text-pb-text"
      >
        {open && (
          <div className="flex min-h-full flex-col">
            <div className="flex items-center justify-between border-b border-pb-border px-5 py-4 sm:px-7">
              <div>{brand}</div>
              <button
                type="button"
                onClick={close}
                className="pb-px-host inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-pb-xs border border-pb-border-strong px-3 text-[0.6875rem] font-medium uppercase tracking-[0.06em] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pb-accent"
              >
                <Pixels />
                <XIcon width={14} height={14} />
                Close
              </button>
            </div>
            <nav aria-label={label} className={cx("grid flex-1 auto-rows-fr", cols)}>
              {links.map((l, i) => {
                const children = (
                  <>
                    <Pixels size={28} />
                    <span className="self-start font-pb-mono text-xs text-pb-muted group-hover/cell:text-inherit">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="grid gap-1">
                      <span className="text-[clamp(2.25rem,6vw,4rem)] font-light leading-none tracking-[-0.035em]">
                        <RollLabel>{l.label}</RollLabel>
                      </span>
                      {l.description && (
                        <span className="text-[0.8125rem] opacity-70">
                          {l.description}
                        </span>
                      )}
                    </span>
                  </>
                );
                const className =
                  "pb-px-host group/cell flex min-h-36 flex-col justify-between gap-6 border-b border-pb-border p-6 no-underline outline-none sm:border-e sm:p-7 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-pb-accent";
                return (
                  <div key={l.href} className="contents">
                    {renderLink ? (
                      renderLink(l, { className, children, onClick: close })
                    ) : (
                      <a
                        href={l.href}
                        aria-current={l.current ? "page" : undefined}
                        className={className}
                        onClick={close}
                      >
                        {children}
                      </a>
                    )}
                  </div>
                );
              })}
            </nav>
            {footer && (
              <div className="px-5 py-4 text-[0.8125rem] text-pb-muted sm:px-7">
                {footer}
              </div>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}
