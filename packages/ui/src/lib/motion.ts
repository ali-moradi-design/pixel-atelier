"use client";

import { type RefObject, useEffect, useState, useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";
const subscribe = (cb: () => void) => {
  if (typeof matchMedia !== "function") return () => {};
  const mq = matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/** True when the user asked the system for less motion. */
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => typeof matchMedia === "function" && matchMedia(QUERY).matches,
    () => false,
  );
}

/** True when the user asked the system for less motion (outside React). */
export function prefersReducedMotion() {
  return typeof matchMedia === "function" && matchMedia(QUERY).matches;
}

/** True on devices with a precise pointer (a mouse or trackpad). */
export function hasFinePointer() {
  return typeof matchMedia === "function" && matchMedia("(pointer: fine)").matches;
}

/**
 * Becomes true once the element has scrolled into view (and stays true).
 * Without IntersectionObserver (old browsers, tests) it is true at once.
 */
export function useInView(
  ref: RefObject<Element | null>,
  { margin = "0px", threshold = 0.2 } = {},
) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (seen || !el) return;
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: margin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, seen, margin, threshold]);
  return seen;
}
