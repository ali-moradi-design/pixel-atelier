import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoAxeViolations } from "../../test/axe.ts";
import { Button } from "../components/button.tsx";
import { FeatureGrid } from "./feature-grid.tsx";
import { Hero } from "./hero.tsx";
import { Pricing } from "./pricing.tsx";
import { SiteFooter } from "./site-footer.tsx";
import { SiteHeader } from "./site-header.tsx";

const plans = [
  {
    name: "Studio",
    price: { monthly: "€19", yearly: "€15" },
    features: ["All components"],
    cta: { label: "Start Studio", href: "/start" },
  },
  {
    name: "Team",
    price: { monthly: "€49", yearly: "€39" },
    features: ["Everything in Studio", "Priority support"],
    cta: { label: "Start Team" },
    featured: true,
  },
];

it("Hero has one h1 and its actions", () => {
  render(
    <Hero
      eyebrow="v1.0"
      title="Pixels, crafted with care."
      description="Calm."
      actions={<Button>Go</Button>}
    />,
  );
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    "Pixels, crafted with care.",
  );
  expect(screen.getByRole("button", { name: "Go" })).toBeInTheDocument();
});

it("Pricing switches billing period", async () => {
  render(
    <Pricing title="Pricing" plans={plans} billingToggle yearlyLabel="Yearly −20%" />,
  );
  expect(screen.getByText("€19")).toBeInTheDocument();
  await userEvent.click(screen.getByRole("tab", { name: "Yearly −20%" }));
  expect(screen.getByText("€15")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Start Studio" })).toHaveAttribute(
    "href",
    "/start",
  );
  expect(screen.getByText("Popular")).toBeInTheDocument();
});

it("SiteHeader and SiteFooter are landmarks with navigation", () => {
  render(
    <>
      <SiteHeader
        brand={<a href="/">Brand</a>}
        links={[{ label: "Work", href: "/work", current: true }]}
      />
      <SiteFooter
        columns={[{ title: "Kit", links: [{ label: "Docs", href: "/docs" }] }]}
        legal="© 2026"
      />
    </>,
  );
  expect(screen.getByRole("banner")).toBeInTheDocument();
  expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Work" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  expect(screen.getByRole("navigation", { name: "Kit" })).toBeInTheDocument();
});

it("blocks have no axe violations", async () => {
  const { container } = render(
    <div>
      <SiteHeader
        brand={<a href="/">Brand</a>}
        links={[{ label: "Work", href: "/work" }]}
      />
      <main>
        <Hero title="Title" description="Text" />
        <FeatureGrid
          title="Features"
          features={[{ title: "Tiny", description: "2 kB" }]}
        />
        <Pricing title="Pricing" plans={plans} billingToggle />
      </main>
      <SiteFooter
        columns={[{ title: "Kit", links: [{ label: "Docs", href: "/docs" }] }]}
      />
    </div>,
  );
  await expectNoAxeViolations(container);
});
