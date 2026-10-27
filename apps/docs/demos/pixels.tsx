import { PixelSpinner, Pixels, RollLabel } from "pixelbits/pixels";

export default function Demo() {
  return (
    <div className="flex items-center gap-6">
      <a
        href="#pixels"
        className="pb-px-host px-6 py-4 text-sm [--px-fill:var(--pb-accent)] [--px-ink:var(--pb-on-accent)]"
      >
        <Pixels size={12} />
        <RollLabel>Hover or focus me</RollLabel>
      </a>
      <PixelSpinner className="text-pb-accent" />
    </div>
  );
}
