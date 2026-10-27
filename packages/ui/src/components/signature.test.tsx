import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoAxeViolations } from "../../test/axe.ts";
import { Button } from "./button.tsx";
import { CursorTrail } from "./cursor-trail.tsx";
import { FullScreenMenu } from "./full-screen-menu.tsx";
import { PixelImageReveal } from "./image-reveal.tsx";
import { Magnetic } from "./magnetic.tsx";
import { Marquee } from "./marquee.tsx";
import { NumberTicker } from "./number-ticker.tsx";
import { PixelTransition, pixelTransition } from "./page-transition.tsx";
import { PixelLoader } from "./pixel-loader.tsx";
import { SpotlightCard } from "./spotlight-card.tsx";
import { TextScramble } from "./text-scramble.tsx";

// jsdom has no canvas or matchMedia; the components must cope.
beforeAll(() => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
  window.matchMedia ??= ((q: string) => ({
    matches: false,
    media: q,
    addEventListener() {},
    removeEventListener() {},
  })) as never;
});

describe("FullScreenMenu", () => {
  const links = [
    { label: "Work", href: "/work", current: true },
    { label: "Studio", href: "/studio", description: "Who we are" },
  ];
  it("opens from the trigger with a navigation of links and closes", async () => {
    render(<FullScreenMenu trigger={<Button>Menu</Button>} links={links} />);
    await userEvent.click(screen.getByRole("button", { name: "Menu" }));
    const nav = screen.getByRole("navigation", { name: "Menu" });
    expect(nav).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Work/ })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("dialog", { name: "Menu" })).toHaveAttribute("open");
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.getByRole("dialog", { hidden: true })).not.toHaveAttribute("open");
  });
  it("closes when a link is followed", async () => {
    render(<FullScreenMenu defaultOpen trigger={<Button>Menu</Button>} links={links} />);
    const link = screen.getByRole("link", { name: /Studio/ });
    link.addEventListener("click", (e) => e.preventDefault());
    await userEvent.click(link);
    expect(screen.getByRole("dialog", { hidden: true })).not.toHaveAttribute("open");
  });
});

describe("text and numbers", () => {
  it("TextScramble reads as the final text", () => {
    const { container } = render(<TextScramble text="Crafted with care" />);
    expect(container.querySelector(".sr-only")).toHaveTextContent("Crafted with care");
    expect(container.querySelector("[aria-hidden]")).toBeInTheDocument();
  });
  it("NumberTicker reads the formatted value once", () => {
    const { container } = render(
      <NumberTicker value={128000} format={{ notation: "compact" }} locale="en" />,
    );
    expect(container.querySelector(".sr-only")).toHaveTextContent("128K");
  });
  it("Button roll keeps one readable label", () => {
    render(<Button roll>Studio</Button>);
    expect(screen.getByRole("button", { name: "Studio" })).toBeInTheDocument();
  });
});

describe("effects", () => {
  it("PixelImageReveal keeps a real image with alt text", () => {
    const { container } = render(<PixelImageReveal src="/a.jpg" alt="A view" />);
    expect(screen.getByRole("img", { name: "A view" })).toBeInTheDocument();
    expect(container.querySelector("canvas")).toHaveAttribute("aria-hidden", "true");
  });
  it("pixelTransition runs the callback with or without the overlay", async () => {
    const a = vi.fn();
    await pixelTransition(a);
    expect(a).toHaveBeenCalledOnce();
    render(<PixelTransition />);
    const b = vi.fn();
    await act(() => pixelTransition(b));
    expect(b).toHaveBeenCalledOnce();
  });
  it("SpotlightCard writes the pointer position to CSS variables", () => {
    render(<SpotlightCard data-testid="card">Hi</SpotlightCard>);
    const card = screen.getByTestId("card");
    fireEvent.pointerMove(card, { clientX: 30, clientY: 40 });
    expect(card.style.getPropertyValue("--pb-x")).toBe("30px");
  });
  it("Marquee hides its copy and loaders have a status role", () => {
    const { container } = render(
      <>
        <Marquee aria-label="Built with">
          <span>Radix</span>
        </Marquee>
        <PixelLoader variant="pulse" label="Loading projects" />
        <Magnetic>
          <Button>Pull</Button>
        </Magnetic>
        <CursorTrail />
      </>,
    );
    expect(container.querySelectorAll(".pb-marquee-track")[1]).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(screen.getByRole("status", { name: "Loading projects" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Pull" })).toBeInTheDocument();
  });
});

it("signature components have no axe violations", async () => {
  const { container } = render(
    <main>
      <h1>
        <TextScramble text="Pixels" />
      </h1>
      <NumberTicker value={42} />
      <PixelLoader />
      <SpotlightCard>
        <p>Card</p>
      </SpotlightCard>
      <Marquee aria-label="Logos">
        <span>One</span>
      </Marquee>
      <PixelImageReveal src="/x.jpg" alt="X" />
    </main>,
  );
  await expectNoAxeViolations(container);
});
