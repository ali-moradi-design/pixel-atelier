import {
  Children,
  cloneElement,
  forwardRef,
  type HTMLAttributes,
  isValidElement,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";

// A small `asChild` helper: renders its child element with the slot's props
// merged in (classes joined, styles merged, event handlers chained, refs
// composed). `Slottable` marks where the child's own children go when the slot
// adds siblings (for example the pixel squares of a button).

type AnyProps = Record<string, unknown>;

function setRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") ref(value);
  else if (ref) (ref as { current: T | null }).current = value;
}

export function composeRefs<T>(...refs: (Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const ref of refs) setRef(ref, node);
  };
}

function mergeProps(slot: AnyProps, child: AnyProps): AnyProps {
  const merged: AnyProps = { ...slot, ...child };
  for (const key in slot) {
    const s = slot[key];
    const c = child[key];
    if (/^on[A-Z]/.test(key) && typeof s === "function" && typeof c === "function") {
      merged[key] = (...args: unknown[]) => {
        c(...args);
        s(...args);
      };
    } else if (key === "className" && s && c) {
      merged[key] = `${s} ${c}`;
    } else if (key === "style" && s && c) {
      merged[key] = { ...(s as object), ...(c as object) };
    }
  }
  return merged;
}

function childRef(el: ReactElement): Ref<unknown> | undefined {
  // React 19 keeps the ref in props; React 18 on the element.
  return ((el.props as AnyProps).ref ?? (el as unknown as { ref?: Ref<unknown> }).ref) as
    | Ref<unknown>
    | undefined;
}

export function Slottable({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export const Slot = forwardRef<
  HTMLElement,
  HTMLAttributes<HTMLElement> & { children?: ReactNode }
>(function Slot({ children, ...props }, ref) {
  const items = Children.toArray(children);
  const marker = items.find(
    (c): c is ReactElement<{ children: ReactNode }> =>
      isValidElement(c) && c.type === Slottable,
  );
  const target = marker ? marker.props.children : children;
  if (!isValidElement(target)) return null;
  const targetProps = target.props as AnyProps;
  const inner = marker
    ? items.map((c) => (c === marker ? (targetProps.children as ReactNode) : c))
    : targetProps.children;
  // Only pass a ref when there is one: server components reject function
  // refs, and a static `<Button asChild>` there has none.
  const refs = [ref, childRef(target)].filter(Boolean) as Ref<unknown>[];
  const merged = mergeProps(props, targetProps);
  if (refs.length === 1) merged.ref = refs[0];
  else if (refs.length > 1) merged.ref = composeRefs(...refs);
  else delete merged.ref;
  return cloneElement(target, merged, ...(Array.isArray(inner) ? inner : [inner]));
});
