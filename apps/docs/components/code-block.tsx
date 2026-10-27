import { highlight } from "@/lib/code";
import { CopyButton } from "./site-client";

/** A highlighted code block with a copy button (rendered at build time). */
export async function CodeBlock({
  code,
  lang = "tsx",
  title,
}: {
  code: string;
  lang?: string;
  title?: string;
}) {
  const html = await highlight(code, lang);
  return (
    <div className="overflow-hidden rounded-pb-md border border-pb-border bg-pb-surface">
      <div className="flex h-9 items-center justify-between border-b border-pb-border ps-3.5 pe-1">
        <span className="font-pb-mono text-[0.6875rem] text-pb-muted">
          {title ?? lang}
        </span>
        <CopyButton text={code.trim()} label="Copy code" />
      </div>
      <div
        className="overflow-x-auto p-4 font-pb-mono text-[0.8125rem] leading-relaxed [&_pre]:outline-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
