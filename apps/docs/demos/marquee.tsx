import { Marquee } from "pixelbits/marquee";

export default function Demo() {
  return (
    <Marquee aria-label="Built with" className="w-full text-2xl font-light text-pb-muted">
      {["Tailwind v4", "React 19", "Native dialog", "Popover API", "Canvas"].map((t) => (
        <span key={t} className="flex items-center gap-10 whitespace-nowrap">
          {t}
          <i className="size-2 bg-pb-accent" />
        </span>
      ))}
    </Marquee>
  );
}
