import { Breadcrumb } from "pixel-atelier/breadcrumb";

export default function Demo() {
  return (
    <Breadcrumb
      items={[
        { label: "Docs", href: "#docs" },
        { label: "Components", href: "#components" },
        { label: "Breadcrumb" },
      ]}
    />
  );
}
