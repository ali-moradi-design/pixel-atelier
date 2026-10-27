"use client";

import { cx } from "class-variance-authority";
import { forwardRef, type HTMLAttributes, type ReactNode, useState } from "react";

/** A deterministic 32-bit hash of a string (FNV-1a). */
function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

/**
 * A 5 x 5 mirrored pixel pattern derived from `seed` (same seed, same
 * pattern), drawn in the text color with one accent pixel. Used as the
 * avatar fallback; also handy as a placeholder anywhere.
 */
export function PixelIdenticon({
  seed,
  className,
}: {
  seed: string;
  className?: string;
}) {
  const h = hash(seed);
  const cells: [number, number][] = [];
  for (let y = 0; y < 5; y++)
    for (let x = 0; x < 3; x++) if ((h >>> (y * 3 + x)) & 1) cells.push([x, y]);
  const accent = (h >>> 20) % cells.length;
  return (
    <svg
      viewBox="0 0 5 5"
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={cx("size-full", className)}
    >
      {cells.flatMap(([x, y], i) => {
        const fill = i === accent ? "var(--pb-accent)" : "currentColor";
        const a = <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={fill} />;
        return x === 2
          ? [a]
          : [
              a,
              <rect
                key={`${4 - x}-${y}`}
                x={4 - x}
                y={y}
                width="1"
                height="1"
                fill={fill}
              />,
            ];
      })}
    </svg>
  );
}

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** The person's name: the accessible label, and the seed of the fallback. */
  name: string;
  /** Photo URL. If missing or broken, the pixel identicon is shown. */
  src?: string;
  /**
   * `"sm"` 24 px, `"md"` 36 px, `"lg"` 48 px, `"xl"` 64 px.
   * @default "md"
   */
  size?: "sm" | "md" | "lg" | "xl";
  /**
   * What to show without a photo: a pixel identicon of the name, or the
   * initials.
   * @default "identicon"
   */
  fallback?: "identicon" | "initials";
  /** A small square in the corner, e.g. `"online"`. */
  status?: "online" | "away" | "busy";
  /** Overrides the visible fallback content entirely. */
  children?: ReactNode;
}

const sizes = {
  sm: "size-6 text-[0.5625rem]",
  md: "size-9 text-xs",
  lg: "size-12 text-sm",
  xl: "size-16 text-base",
};
const statusColor = {
  online: "bg-pb-success",
  away: "bg-pb-warning",
  busy: "bg-pb-danger",
};

/**
 * A person's picture, square with a 2 px radius like the rest of the kit.
 * Without a photo it shows a pixel identicon unique to the name (or the
 * initials).
 *
 * @example
 * ```tsx
 * <Avatar name="Ali Moradi" src="/ali.jpg" status="online" />
 * <Avatar name="Karen Ross" fallback="initials" />
 * ```
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  {
    name,
    src,
    size = "md",
    fallback = "identicon",
    status,
    className,
    children,
    ...props
  },
  ref,
) {
  const [failed, setFailed] = useState(false);
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <span
      ref={ref}
      role="img"
      aria-label={name}
      className={cx(
        "relative inline-grid shrink-0 place-items-center rounded-[2px] border border-pb-border-strong bg-pb-surface font-pb-mono font-medium text-pb-text",
        sizes[size],
        className,
      )}
      {...props}
    >
      <span className="grid size-full place-items-center overflow-hidden rounded-[1px]">
        {children ??
          (src && !failed ? (
            <img
              src={src}
              alt=""
              className="size-full object-cover"
              onError={() => setFailed(true)}
            />
          ) : fallback === "initials" ? (
            initials
          ) : (
            <PixelIdenticon seed={name} className="p-[12%]" />
          ))}
      </span>
      {status && (
        <span
          aria-hidden="true"
          className={cx(
            "absolute -end-0.5 -bottom-0.5 size-2.5 border-2 border-pb-bg",
            statusColor[status],
          )}
        />
      )}
    </span>
  );
});

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Show at most this many avatars, then a `+N` square.
   * @default 4
   */
  max?: number;
  /** `Avatar`s. */
  children: ReactNode;
}

/**
 * Overlapping avatars for a team or the people on a document.
 *
 * @example
 * ```tsx
 * <AvatarGroup max={3}>{people.map((p) => <Avatar key={p.id} name={p.name} src={p.photo} />)}</AvatarGroup>
 * ```
 */
export function AvatarGroup({
  max = 4,
  className,
  children,
  ...props
}: AvatarGroupProps) {
  const list = (Array.isArray(children) ? children : [children]).flat();
  const shown = list.slice(0, max);
  const rest = list.length - shown.length;
  return (
    <div
      className={cx(
        "flex items-center [&>*]:ring-2 [&>*]:ring-pb-surface [&>*+*]:-ms-2",
        className,
      )}
      {...props}
    >
      {shown}
      {rest > 0 && (
        <span className="inline-grid size-9 place-items-center rounded-[2px] border border-pb-border-strong bg-pb-raised font-pb-mono text-xs text-pb-muted">
          +{rest}
        </span>
      )}
    </div>
  );
}
