import { Hero } from "pixel-atelier/blocks/hero";
import { Button } from "pixel-atelier/button";
import { SpotlightCard } from "pixel-atelier/spotlight-card";

export default function Demo() {
  return (
    <Hero
      className="py-4 sm:py-4"
      eyebrow="Now in 1.0"
      title="Pixels, crafted with care."
      scramble
      description="A calm React UI kit whose pixel effects appear only when you interact."
      actions={
        <>
          <Button variant="primary" size="lg" roll>
            Get started
          </Button>
          <Button size="lg" roll>
            Read the docs
          </Button>
        </>
      }
      media={<SpotlightCard className="aspect-[4/3]" />}
    />
  );
}
