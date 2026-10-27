/**
 * The mark: a brilliant-cut gem drawn in pixels, lit from the top left. Four
 * gold tones shade the table, crown and pavilion; the facet lines and the
 * girdle are cut out as negative space. Same grid as brand/source/build.mjs.
 */
export const GEM = [
  "...bbaaacc...",
  "..bb.aaa.cc..",
  ".bbb.aaa.ccc.",
  ".............",
  ".ccccc.ddddd.",
  "..cccc.dddd..",
  "...ccc.ddd...",
  "....cc.dd....",
  ".....c.d.....",
];

// Tones of the gold ramp (set per theme in styles/globals.css), so the gem
// stays gold on both backgrounds.
const TONE: Record<string, string> = {
  a: "var(--gem-a)",
  b: "var(--gem-b)",
  c: "var(--gem-c)",
  d: "var(--gem-d)",
};

export function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 13 9"
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={className}
    >
      {Object.entries(TONE).map(([tone, fill]) => (
        <path
          key={tone}
          fill={fill}
          d={GEM.flatMap((row, y) =>
            [...row].flatMap((c, x) => (c === tone ? [`M${x} ${y}h1v1h-1z`] : [])),
          ).join("")}
        />
      ))}
    </svg>
  );
}

/** Mark + wordmark in Story Script. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <Mark className="h-[1.125rem] w-auto" />
      <span className="font-story text-[1.375rem] leading-none tracking-[0.01em] text-pb-text">
        Pixelbits
      </span>
    </span>
  );
}
