import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoAxeViolations } from "../../test/axe.ts";
import { Badge } from "./badge.tsx";
import { Tag } from "./tag.tsx";
import { TextLink } from "./text-link.tsx";

describe("TextLink", () => {
  it("renders an anchor or its child", () => {
    render(
      <>
        <TextLink href="/docs">Docs</TextLink>
        <TextLink asChild variant="pixel">
          <a href="/x">Child</a>
        </TextLink>
      </>,
    );
    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute("href", "/docs");
    expect(screen.getByRole("link", { name: "Child" })).toHaveClass("pb-link-px");
  });
});

describe("Badge", () => {
  it("shows text and an optional dot", () => {
    const { container } = render(
      <Badge variant="success" dot>
        Live
      </Badge>,
    );
    expect(screen.getByText("Live")).toBeInTheDocument();
    expect(container.querySelector("[aria-hidden]")).toBeInTheDocument();
  });
});

describe("Tag", () => {
  it("has a labelled remove button that calls onRemove", async () => {
    const onRemove = vi.fn();
    render(<Tag onRemove={onRemove}>react</Tag>);
    await userEvent.click(screen.getByRole("button", { name: "Remove react" }));
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <p>
        <Tag onRemove={() => {}}>react</Tag> <Badge>New</Badge>{" "}
        <TextLink href="/">Home</TextLink>
      </p>,
    );
    await expectNoAxeViolations(container);
  });
});
