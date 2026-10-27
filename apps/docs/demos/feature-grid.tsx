import { FeatureGrid } from "pixelbits/blocks/feature-grid";

const icon = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
  </svg>
);

export default function Demo() {
  return (
    <FeatureGrid
      className="py-4 sm:py-4"
      title="Why Pixelbits"
      description="A quiet base, with detail where it counts."
      features={[
        {
          icon,
          title: "Effects on interaction",
          description:
            "Hover, focus, open and loading get pixels. Nothing moves at rest.",
        },
        {
          icon,
          title: "Tiny bundles",
          description: "One entry per component; Button is about 2 kB.",
        },
        {
          icon,
          title: "Platform first",
          description: "Native dialog, popover and form inputs.",
        },
      ]}
    />
  );
}
