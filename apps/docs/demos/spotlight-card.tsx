import { SpotlightCard } from "pixelbits/spotlight-card";

export default function Demo() {
  return (
    <SpotlightCard className="grid min-h-56 w-full max-w-md content-end gap-1.5 p-6">
      <span className="font-pb-mono text-[0.625rem] uppercase tracking-[0.12em] text-pb-muted">
        Spotlight card
      </span>
      <h3 className="text-xl font-light tracking-tight">Follows the pointer</h3>
    </SpotlightCard>
  );
}
