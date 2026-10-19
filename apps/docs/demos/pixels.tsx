import { PixelSpinner, Pixels, RollLabel } from "pixel-atelier/pixels";

export default function Demo() {
  return (
    <div className="flex items-center gap-6">
      <a
        href="#pixels"
        className="pa-px-host px-6 py-4 text-sm [--px-fill:var(--pa-accent)] [--px-ink:var(--pa-on-accent)]"
      >
        <Pixels size={12} />
        <RollLabel>Hover or focus me</RollLabel>
      </a>
      <PixelSpinner className="text-pa-accent" />
    </div>
  );
}
