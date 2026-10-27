import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "pixelbits/button";
import { CursorTrail } from "pixelbits/cursor-trail";
import { FullScreenMenu } from "pixelbits/full-screen-menu";
import { PixelImageReveal } from "pixelbits/image-reveal";
import { Magnetic } from "pixelbits/magnetic";
import { Marquee } from "pixelbits/marquee";
import { NumberTicker } from "pixelbits/number-ticker";
import { PixelTransition, pixelTransition } from "pixelbits/page-transition";
import { PixelLoader } from "pixelbits/pixel-loader";
import { SpotlightCard } from "pixelbits/spotlight-card";
import { TextScramble } from "pixelbits/text-scramble";
import { useState } from "react";

const meta = {
  title: "Signature/All",
  component: Button,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

const sunset = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d1a2b"/><stop offset=".55" stop-color="#7a4a3a"/><stop offset="1" stop-color="#e2a36a"/></linearGradient></defs><rect width="400" height="500" fill="url(#g)"/><circle cx="265" cy="260" r="70" fill="#f6d39a"/><path d="M0 330 Q100 280 200 335 T400 320 V500 H0Z" fill="#3b2730"/><path d="M0 390 Q120 350 240 395 T400 380 V500 H0Z" fill="#24181f"/><path d="M0 440 Q140 410 260 445 T400 435 V500 H0Z" fill="#120d11"/></svg>`,
)}`;

const mark = (
  <span className="flex items-center gap-2 text-sm font-medium">
    <svg
      viewBox="0 0 8 8"
      className="size-5"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M0 0h8v1H0zM0 1h1v7H0zM5 1h3v1H5zM6 2h2v2H6zM5 4h3v1H5zM3 5h4v1H3zM3 6h2v1H3zM1 7h3v1H1zM5 7h1v1H5z"
      />
      <path fill="var(--pb-accent)" d="M6 6h1v1H6z" />
    </svg>
    pixel<span className="font-light">bits</span>
  </span>
);

export const PixelButtons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button size="lg" roll>
        Start a project
      </Button>
      <Button size="lg" variant="primary" roll>
        Download
      </Button>
      <Magnetic>
        <Button size="lg" variant="primary">
          Magnetic
        </Button>
      </Magnetic>
    </div>
  ),
};

export const Menu: Story = {
  render: () => (
    <FullScreenMenu
      defaultOpen
      brand={mark}
      trigger={<Button size="sm">Menu</Button>}
      links={[
        { label: "Work", href: "#work", description: "Selected projects" },
        { label: "Studio", href: "#studio" },
        { label: "Journal", href: "#journal" },
        { label: "Contact", href: "#contact" },
      ]}
      footer="hello@pixelbits.dev"
    />
  ),
};

export const ImageReveal: Story = {
  render: () => (
    <div className="grid max-w-xl grid-cols-2 gap-4">
      <PixelImageReveal
        src={sunset}
        alt="Sunset over hills"
        wrapperClassName="aspect-[4/5] rounded-pb-sm"
      />
      <PixelImageReveal
        src={sunset}
        alt="Sunset, revealed on hover"
        trigger="hover"
        wrapperClassName="aspect-[4/5] rounded-pb-sm"
      />
    </div>
  ),
};

export const TextAndNumbers: Story = {
  render: function Render() {
    const [n, setN] = useState(128);
    return (
      <div className="grid gap-6">
        <h2 className="text-pb-display font-light">
          <TextScramble text="Crafted with care" />
        </h2>
        <div className="flex items-baseline gap-4">
          <NumberTicker value={n} className="text-6xl font-light tracking-tight" />
          <span className="text-3xl text-pb-accent">k</span>
          <Button size="sm" onClick={() => setN(Math.round(Math.random() * 900))}>
            Random
          </Button>
        </div>
        <Marquee aria-label="Built with" className="text-3xl font-light text-pb-muted">
          {["Tailwind v4", "React 19", "Native dialog", "Popover API", "Canvas"].map(
            (t) => (
              <span key={t} className="flex items-center gap-10 whitespace-nowrap">
                {t}
                <i className="size-2 bg-pb-accent" />
              </span>
            ),
          )}
        </Marquee>
      </div>
    );
  },
};

export const LoadersAndSpotlight: Story = {
  render: () => (
    <div className="grid max-w-3xl gap-6">
      <div className="flex items-center gap-10">
        <PixelLoader />
        <PixelLoader variant="pulse" size={10} />
        <PixelLoader variant="noise" size={6} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <SpotlightCard className="grid min-h-56 content-end gap-1.5 p-6">
          <span className="font-pb-mono text-[0.625rem] uppercase tracking-[0.12em] text-pb-muted">
            Spotlight card
          </span>
          <h3 className="text-xl font-light tracking-tight">Follows the pointer</h3>
        </SpotlightCard>
        <SpotlightCard grid={false} className="grid min-h-56 content-end p-6">
          <h3 className="text-xl font-light tracking-tight">Glow only</h3>
        </SpotlightCard>
      </div>
    </div>
  ),
};

export const PageTransitionAndTrail: Story = {
  render: () => (
    <div className="grid gap-4">
      <PixelTransition />
      <CursorTrail />
      <p className="text-sm text-pb-muted">Move the mouse for the trail.</p>
      <Button
        variant="primary"
        onClick={() => pixelTransition(() => new Promise((r) => setTimeout(r, 300)))}
      >
        Run page transition
      </Button>
    </div>
  ),
};
