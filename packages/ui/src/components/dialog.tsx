"use client";

import { cx } from "class-variance-authority";
import {
  createContext,
  type DialogHTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { XIcon } from "../lib/icons.tsx";
import { Slot } from "../lib/slot.tsx";
import { useControllable } from "../lib/use-controllable.ts";

const CloseContext = createContext<(() => void) | null>(null);

/** Base props of `Dialog` and `Sheet`. */
export interface DialogProps
  extends Omit<DialogHTMLAttributes<HTMLDialogElement>, "open" | "title"> {
  /** Whether it is open (controlled). */
  open?: boolean;
  /**
   * Open on first render (uncontrolled).
   * @default false
   */
  defaultOpen?: boolean;
  /** Called when it opens or closes (trigger, close button, Escape, backdrop). */
  onOpenChange?: (open: boolean) => void;
  /**
   * An element that opens it on click, usually a `Button`. It gets
   * `aria-haspopup="dialog"` and the dialog returns focus to it on close.
   */
  trigger?: ReactElement;
  /** Heading, linked with `aria-labelledby`. Strongly recommended. */
  title?: ReactNode;
  /** Text under the heading, linked with `aria-describedby`. */
  description?: ReactNode;
  /** Actions shown at the bottom, usually `Button`s and a `DialogClose`. */
  footer?: ReactNode;
  /**
   * Close when the backdrop is clicked. Escape always closes.
   * @default true
   */
  dismissible?: boolean;
  /**
   * Show the × button in the corner.
   * @default true
   */
  closeButton?: boolean;
  /** The body. */
  children?: ReactNode;
}

function useNativeDialog(props: DialogProps) {
  const { open: openProp, defaultOpen = false, onOpenChange } = props;
  const [open, setOpen] = useControllable(openProp, defaultOpen, onOpenChange);
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      if (typeof d.showModal === "function") d.showModal();
      else d.setAttribute("open", "");
    } else if (!open && d.open) {
      if (typeof d.close === "function") d.close();
      else d.removeAttribute("open");
    }
  }, [open]);
  return { open, setOpen, ref };
}

function DialogShell({
  kind,
  side,
  ...props
}: DialogProps & {
  kind: "dialog" | "sheet";
  side?: "start" | "end" | "top" | "bottom";
}) {
  const {
    trigger,
    title,
    description,
    footer,
    dismissible = true,
    closeButton = true,
    children,
    className,
    open: _o,
    defaultOpen: _d,
    onOpenChange: _c,
    ...rest
  } = props;
  const { open, setOpen, ref } = useNativeDialog(props);
  const id = useId();
  // Content is rendered from the first open on (not before, to keep closed
  // dialogs free), and stays so the close animation shows it.
  const [mounted, setMounted] = useState(open);
  if (open && !mounted) setMounted(true);
  const close = () => setOpen(false);
  const onBackdrop = (e: MouseEvent<HTMLDialogElement>) => {
    // A click on the <dialog> itself (not its content) is a click on the backdrop.
    if (dismissible && e.target === e.currentTarget) close();
  };
  return (
    <>
      {trigger && (
        <Slot aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>
          {trigger}
        </Slot>
      )}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: Escape is handled natively by <dialog> */}
      <dialog
        ref={ref}
        aria-labelledby={title ? `${id}-title` : undefined}
        aria-describedby={description ? `${id}-desc` : undefined}
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClose={() => open && close()}
        onClick={onBackdrop}
        data-side={side}
        className={cx(
          "pa-dialog max-h-[calc(100dvh-2rem)] overflow-visible bg-transparent p-0 text-pa-text",
          kind === "sheet" && "pa-sheet",
          className,
        )}
        {...rest}
      >
        {mounted && (
          <CloseContext.Provider value={close}>
            <div
              className={cx(
                "relative grid max-h-[inherit] gap-3 overflow-auto border border-pa-border bg-pa-overlay shadow-pa-3",
                kind === "dialog"
                  ? "w-[min(28rem,calc(100vw-2rem))] rounded-pa-lg p-6"
                  : "size-full content-start p-6",
              )}
            >
              {title && (
                <h2
                  id={`${id}-title`}
                  className="pe-8 text-base font-medium tracking-[-0.01em]"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  id={`${id}-desc`}
                  className="text-[0.8125rem] leading-relaxed text-pa-muted"
                >
                  {description}
                </p>
              )}
              {children}
              {footer && (
                <div className="mt-2 flex flex-wrap justify-end gap-2">{footer}</div>
              )}
              {closeButton && (
                <button
                  type="button"
                  aria-label="Close"
                  onClick={close}
                  className="absolute end-3.5 top-3.5 inline-grid size-7 cursor-pointer place-items-center rounded-pa-xs text-pa-muted outline-none hover:bg-pa-raised hover:text-pa-text focus-visible:outline-2 focus-visible:outline-pa-accent"
                >
                  <XIcon />
                </button>
              )}
            </div>
          </CloseContext.Provider>
        )}
      </dialog>
    </>
  );
}

/**
 * A modal dialog on the native `<dialog>` element: the page behind becomes
 * inert, focus is trapped and returns to the trigger, Escape closes it, and
 * it sits in the top layer above everything. Page scrolling is locked while
 * it is open.
 *
 * @example
 * ```tsx
 * <Dialog
 *   trigger={<Button variant="primary">Publish</Button>}
 *   title="Publish component?"
 *   description="It will be added to the public registry."
 *   footer={<><DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose><Button variant="primary" onClick={publish}>Publish</Button></>}
 * />
 * ```
 */
export function Dialog(props: DialogProps) {
  return <DialogShell kind="dialog" {...props} />;
}

export interface SheetProps extends DialogProps {
  /**
   * The edge it slides in from. `"start"`/`"end"` follow the text direction
   * (left/right in LTR, right/left in RTL).
   * @default "end"
   */
  side?: "start" | "end" | "top" | "bottom";
}

/**
 * A panel that slides in from an edge: filters, navigation, details. Same
 * behavior and props as `Dialog` (it is a modal `<dialog>` too).
 *
 * @example
 * ```tsx
 * <Sheet side="end" trigger={<Button>Filters</Button>} title="Filters">…</Sheet>
 * ```
 */
export function Sheet({ side = "end", ...props }: SheetProps) {
  return <DialogShell kind="sheet" side={side} {...props} />;
}

export interface DialogCloseProps {
  /**
   * Render the child element (for example a `Button`) as the close control
   * instead of a plain button.
   * @default false
   */
  asChild?: boolean;
  /** The label or the element to use. */
  children: ReactNode;
}

/**
 * Closes the surrounding `Dialog` or `Sheet` when clicked.
 *
 * @example
 * ```tsx
 * <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
 * ```
 */
export function DialogClose({ asChild = false, children }: DialogCloseProps) {
  const close = useContext(CloseContext);
  if (asChild) return <Slot onClick={() => close?.()}>{children}</Slot>;
  return (
    <button type="button" onClick={() => close?.()}>
      {children}
    </button>
  );
}
