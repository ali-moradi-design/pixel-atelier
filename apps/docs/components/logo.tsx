/** The P1 mark: a tile with a cut-out P whose corner dissolves. */
const GRID = [
  "########",
  "#....###",
  "#..##.##",
  "#..##.##",
  "#....###",
  "#..####.",
  "#..##.A.",
  "####.#..",
];

export function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 8 8"
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={className}
    >
      {GRID.flatMap((row, y) =>
        [...row].map((c, x) =>
          c === "." ? null : (
            <rect
              // biome-ignore lint/suspicious/noArrayIndexKey: grid coordinates are the identity
              key={`${x}-${y}`}
              x={x}
              y={y}
              width="1"
              height="1"
              fill={c === "A" ? "var(--pa-accent)" : "currentColor"}
            />
          ),
        ),
      )}
    </svg>
  );
}

export function Logo() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <Mark className="size-6" />
      <span className="text-[0.9375rem] font-medium tracking-[-0.01em]">
        pixel <span className="font-light">atelier</span>
      </span>
    </span>
  );
}
