import { Badge } from "pixelbits/badge";
import { Card } from "pixelbits/card";

export default function Demo() {
  return (
    <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
      <Card
        interactive
        media={
          <div className="h-32 bg-[linear-gradient(180deg,#1d1a2b,#7a4a3a_60%,#e2a36a)]" />
        }
        eyebrow="Case study"
        title="Atelier Noir"
        description="A fashion house site built on the kit."
      />
      <Card
        title="Pixel button"
        description="The signature hover dissolve."
        footer={
          <Badge variant="success" dot>
            Stable
          </Badge>
        }
      />
    </div>
  );
}
