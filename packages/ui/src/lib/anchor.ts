/**
 * Places a top-layer popover (`popover` attribute) next to its anchor, below
 * it by default and above when there is not enough room, and keeps it there
 * on scroll and resize. Returns a cleanup function.
 *
 * Small on purpose: no collision engine, just flip and clamp to the viewport.
 */
export function anchorTo(
  popup: HTMLElement,
  anchor: HTMLElement,
  {
    gap = 4,
    matchWidth = false,
    align = "start",
  }: { gap?: number; matchWidth?: boolean; align?: "start" | "center" | "end" } = {},
) {
  const place = () => {
    const a = anchor.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    const s = popup.style;
    s.position = "fixed";
    s.inset = "auto";
    s.margin = "0";
    if (matchWidth) s.minWidth = `${a.width}px`;
    const p = popup.getBoundingClientRect();
    const below = vh - a.bottom - gap;
    const top =
      below >= p.height || below >= a.top ? a.bottom + gap : a.top - gap - p.height;
    const rtl = getComputedStyle(anchor).direction === "rtl";
    const start = rtl ? a.right - p.width : a.left;
    const end = rtl ? a.left : a.right - p.width;
    let left =
      align === "center"
        ? a.left + (a.width - p.width) / 2
        : align === "end"
          ? end
          : start;
    left = Math.max(8, Math.min(left, vw - p.width - 8));
    s.top = `${Math.max(8, top)}px`;
    s.left = `${left}px`;
    popup.dataset.side = top > a.top ? "bottom" : "top";
  };
  place();
  const opts = { capture: true, passive: true } as const;
  window.addEventListener("scroll", place, opts);
  window.addEventListener("resize", place, opts);
  return () => {
    window.removeEventListener("scroll", place, opts);
    window.removeEventListener("resize", place, opts);
  };
}

/**
 * Puts the element in the top layer with the popover API when the browser has
 * it (so no parent can clip it); otherwise it stays a fixed-position element.
 * The attribute is set here, not in markup, so browsers without the API (and
 * jsdom) never hide the element.
 */
export function showPopover(el: HTMLElement | null) {
  if (!el || typeof el.showPopover !== "function") return;
  if (!el.hasAttribute("popover")) el.setAttribute("popover", "manual");
  if (!el.matches(":popover-open")) el.showPopover();
}
/** Hides a popover if it is open. */
export function hidePopover(el: HTMLElement | null) {
  if (el && typeof el.hidePopover === "function" && el.matches(":popover-open"))
    el.hidePopover();
}

/**
 * Calls `onOutside` on a pointer press outside all of `inside`. Returns a
 * cleanup function.
 */
export function onPointerDownOutside(inside: (Element | null)[], onOutside: () => void) {
  const handler = (e: PointerEvent) => {
    const t = e.target as Node;
    if (!inside.some((el) => el?.contains(t))) onOutside();
  };
  document.addEventListener("pointerdown", handler, true);
  return () => document.removeEventListener("pointerdown", handler, true);
}
