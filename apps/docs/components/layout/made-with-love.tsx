import { site } from "@/lib/site";

const HEART = [".##.##.", "#######", "#######", ".#####.", "..###..", "...#..."];

/** "Made with ♥ by Ali Moradi", with a pixel heart. Shown on every page. */
export function MadeWithLove({
  lang = "en",
  className,
}: {
  lang?: "en" | "fa";
  className?: string;
}) {
  const heart = (
    <svg
      viewBox="0 0 7 6"
      shapeRendering="crispEdges"
      role="img"
      aria-label={lang === "fa" ? "عشق" : "love"}
      className="pb-heart inline-block h-[0.8em] w-auto align-[-0.05em]"
    >
      <path
        fill="oklch(0.66 0.19 18)"
        d={HEART.flatMap((row, y) =>
          [...row].flatMap((c, x) => (c === "#" ? [`M${x} ${y}h1v1h-1z`] : [])),
        ).join("")}
      />
    </svg>
  );
  const author = (
    <a
      href={site.author.url}
      className="text-pb-text underline decoration-pb-border-strong underline-offset-4 transition-colors hover:text-pb-accent hover:decoration-pb-accent"
    >
      {lang === "fa" ? "علی مرادی" : site.author.name}
    </a>
  );
  return lang === "fa" ? (
    <p className={className}>
      ساخته‌شده با {heart} توسط {author}
    </p>
  ) : (
    <p className={className}>
      Made with {heart} by {author}
    </p>
  );
}
