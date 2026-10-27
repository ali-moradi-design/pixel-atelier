import { PixelLoader } from "pixelbits/pixel-loader";

const variants = [
  { variant: "snake", label: "Snake", hint: "Loading a list" },
  { variant: "pulse", label: "Pulse", hint: "Waiting on a reply" },
  { variant: "noise", label: "Noise", hint: "Processing data" },
] as const;

export default function Demo() {
  return (
    <div className="grid w-full max-w-xl gap-4 sm:grid-cols-3">
      {variants.map((v) => (
        <div
          key={v.variant}
          className="grid justify-items-center gap-4 rounded-pb-md border border-pb-border bg-pb-bg p-6 text-pb-text"
        >
          <div className="grid h-12 place-items-center">
            <PixelLoader
              variant={v.variant}
              size={v.variant === "noise" ? 6 : 10}
              label={v.hint}
            />
          </div>
          <div className="grid justify-items-center gap-0.5">
            <span className="text-sm">{v.label}</span>
            <span className="text-xs text-pb-muted">{v.hint}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
