import { Fragment, type ReactNode } from "react";

/** Inline `code` spans. */
function inline(text: string): ReactNode[] {
  return text.split(/(`[^`]+`)/g).map((part, i) =>
    part.startsWith("`") && part.endsWith("`") ? (
      // biome-ignore lint/suspicious/noArrayIndexKey: static text
      <code key={i}>{part.slice(1, -1)}</code>
    ) : (
      // biome-ignore lint/suspicious/noArrayIndexKey: static text
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

/** Renders the small Markdown subset used in TSDoc: paragraphs, "- " lists and `code`. */
export function Md({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/);
  return (
    <>
      {blocks.map((b, i) => {
        const lines = b.split("\n");
        const items = lines.reduce<string[]>((acc, l) => {
          if (/^\s*- /.test(l)) acc.push(l.replace(/^\s*- /, ""));
          else if (acc.length) acc[acc.length - 1] += ` ${l.trim()}`;
          return acc;
        }, []);
        const lead = lines
          .filter(
            (_l, k) =>
              k < lines.findIndex((x) => /^\s*- /.test(x)) ||
              !lines.some((x) => /^\s*- /.test(x)),
          )
          .join(" ");
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: static text
          <Fragment key={i}>
            {lead && <p>{inline(lead)}</p>}
            {items.length > 0 && (
              <ul className="ms-4 list-disc space-y-1 text-pb-muted marker:text-pb-accent">
                {items.map((it, k) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static text
                  <li key={k}>{inline(it)}</li>
                ))}
              </ul>
            )}
          </Fragment>
        );
      })}
    </>
  );
}
