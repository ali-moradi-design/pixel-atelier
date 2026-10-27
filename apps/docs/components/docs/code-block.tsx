import { CopyButton } from "@/components/ui/copy-button";
import { highlight } from "@/lib/highlight";

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
  const highlighted = await highlight(code, lang);
  return (
    <div className="pb-code overflow-hidden rounded-pb-md border border-pb-border bg-pb-surface">
      <div className="flex h-9 items-center justify-between border-b border-pb-border ps-3.5 pe-1">
        <span className="flex items-center gap-2 font-pb-mono text-[0.6875rem] text-pb-muted">
          <i aria-hidden="true" className="size-1.5 bg-pb-accent" />
          {title ?? lang}
        </span>
        <CopyButton text={code.trim()} label="Copy code" />
      </div>
      <div className="overflow-x-auto p-4 font-pb-mono text-[0.8125rem] leading-relaxed [&_pre]:outline-none">
        {highlighted}
      </div>
    </div>
  );
}
