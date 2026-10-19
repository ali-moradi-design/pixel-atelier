import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoAxeViolations } from "../../test/axe.ts";
import { Button } from "./button.tsx";
import { IconButton } from "./icon-button.tsx";

describe("Button", () => {
  it("is a type=button by default and calls onClick", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveAttribute("type", "button");
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("creates the pixel squares only on the first hover or focus", () => {
    const { container } = render(<Button>Explore</Button>);
    const pixels = container.querySelector("[data-pa-pixels]");
    expect(pixels).toBeInTheDocument();
    expect(pixels?.children).toHaveLength(0);
    fireEvent.pointerEnter(screen.getByRole("button"));
    expect(pixels?.children.length).toBeGreaterThan(0);
  });

  it("also wakes on keyboard focus", async () => {
    const { container } = render(<Button>Explore</Button>);
    await userEvent.tab();
    expect(screen.getByRole("button")).toHaveFocus();
    expect(container.querySelector("[data-pa-pixels]")?.children.length).toBeGreaterThan(
      0,
    );
  });

  it("can be a plain button without pixels", () => {
    const { container } = render(<Button pixel={false}>Plain</Button>);
    expect(container.querySelector("[data-pa-pixels]")).toBeNull();
  });

  it("renders its child with asChild", () => {
    render(
      <Button asChild variant="primary">
        <a href="/start">Start</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Start" });
    expect(link).toHaveClass("pa-px-host");
    expect(link).not.toHaveAttribute("type");
  });

  it("is busy and disabled while loading", () => {
    render(<Button loading>Saving</Button>);
    const button = screen.getByRole("button", { name: /saving/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("forwards its ref", () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Button ref={ref}>Ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <div>
        <Button variant="primary">Primary</Button>
        <Button>Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Delete</Button>
        <IconButton aria-label="Add">+</IconButton>
      </div>,
    );
    await expectNoAxeViolations(container);
  });
});
