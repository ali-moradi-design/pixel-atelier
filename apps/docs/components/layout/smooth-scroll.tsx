"use client";

import Lenis from "lenis";
import { useEffect } from "react";

/**
 * Smooth, inertial page scrolling (Lenis). Off for reduced motion and touch
 * (native scrolling feels better there). Inner scroll areas with
 * data-lenis-prevent, open dialogs and popovers keep native scrolling.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !matchMedia("(pointer: fine)").matches
    )
      return;
    const lenis = new Lenis({
      lerp: 0.12,
      anchors: { offset: -80 },
      prevent: (node) =>
        node.closest("dialog[open], [popover], [data-lenis-prevent]") !== null,
    });
    let raf = requestAnimationFrame(function loop(time) {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
  return null;
}
