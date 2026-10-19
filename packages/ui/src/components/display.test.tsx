import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoAxeViolations } from "../../test/axe.ts";
import { Avatar, AvatarGroup, PixelIdenticon } from "./avatar.tsx";
import { Breadcrumb } from "./breadcrumb.tsx";
import { Card } from "./card.tsx";
import { Pagination, paginationRange } from "./pagination.tsx";
import { Progress } from "./progress.tsx";
import { Skeleton } from "./skeleton.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table.tsx";

describe("Avatar", () => {
  it("is an image named after the person and falls back to an identicon", () => {
    const { container } = render(<Avatar name="Ali Moradi" src="/missing.jpg" />);
    expect(screen.getByRole("img", { name: "Ali Moradi" })).toBeInTheDocument();
    fireEvent.error(container.querySelector("img") as HTMLImageElement);
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("svg rect")).toBeInTheDocument();
  });
  it("shows initials when asked", () => {
    render(<Avatar name="Karen Ross" fallback="initials" />);
    expect(screen.getByRole("img")).toHaveTextContent("KR");
  });
  it("draws the same identicon for the same seed, mirrored", () => {
    const a = render(<PixelIdenticon seed="pixel" />).container.innerHTML;
    const b = render(<PixelIdenticon seed="pixel" />).container.innerHTML;
    expect(a).toBe(b);
    const rects = [
      ...render(<PixelIdenticon seed="atelier" />).container.querySelectorAll("rect"),
    ].map((r) => `${r.getAttribute("x")},${r.getAttribute("y")}`);
    for (const xy of rects) {
      const [x, y] = xy.split(",").map(Number) as [number, number];
      expect(rects).toContain(`${4 - x},${y}`);
    }
  });
  it("groups with a +N overflow", () => {
    render(
      <AvatarGroup max={2}>
        <Avatar name="A B" />
        <Avatar name="C D" />
        <Avatar name="E F" />
      </AvatarGroup>,
    );
    expect(screen.getAllByRole("img")).toHaveLength(2);
    expect(screen.getByText("+1")).toBeInTheDocument();
  });
});

describe("Pagination", () => {
  it("computes ranges with gaps", () => {
    expect(paginationRange(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(paginationRange(1, 20)).toEqual([1, 2, 3, 4, 5, "…", 20]);
    expect(paginationRange(10, 20)).toEqual([1, "…", 9, 10, 11, "…", 20]);
    expect(paginationRange(20, 20)).toEqual([1, "…", 16, 17, 18, 19, 20]);
  });
  it("marks the current page and moves with buttons", async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={1} count={9} onPageChange={onPageChange} />);
    expect(screen.getByRole("button", { name: "Page 1" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });
  it("renders links with href", () => {
    render(<Pagination page={2} count={3} href={(p) => `/blog?page=${p}`} />);
    expect(screen.getByRole("link", { name: "Page 3" })).toHaveAttribute(
      "href",
      "/blog?page=3",
    );
  });
});

describe("Breadcrumb, Table, Progress, Card, Skeleton", () => {
  it("marks the current crumb", () => {
    render(
      <Breadcrumb items={[{ label: "Docs", href: "/docs" }, { label: "Button" }]} />,
    );
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute("href", "/docs");
    expect(screen.getByText("Button")).toHaveAttribute("aria-current", "page");
  });
  it("sorts from a header button with aria-sort", async () => {
    const onSort = vi.fn();
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sort="ascending" onSort={onSort}>
              Name
            </TableHead>
            <TableHead numeric>kB</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow selected>
            <TableCell>Button</TableCell>
            <TableCell numeric>2.0</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByRole("columnheader", { name: /Name/ })).toHaveAttribute(
      "aria-sort",
      "ascending",
    );
    await userEvent.click(screen.getByRole("button", { name: /Name/ }));
    expect(onSort).toHaveBeenCalledOnce();
    expect(screen.getByRole("row", { selected: true })).toBeInTheDocument();
  });
  it("exposes progress values", () => {
    render(
      <>
        <Progress label="Upload" value={64} />
        <Progress label="Build" value={26} max={40} variant="pixel" />
        <Progress aria-label="Loading" />
      </>,
    );
    expect(screen.getByRole("progressbar", { name: "Upload" })).toHaveAttribute(
      "aria-valuenow",
      "64",
    );
    expect(screen.getByText("64%")).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "Build" })).toHaveAttribute(
      "aria-valuemax",
      "40",
    );
    expect(screen.getByRole("progressbar", { name: "Loading" })).not.toHaveAttribute(
      "aria-valuenow",
    );
  });
  it("renders card parts and hides skeletons from assistive tech", () => {
    const { container } = render(
      <>
        <Card
          eyebrow="Case study"
          title="Atelier Noir"
          description="A fashion house site."
          footer={<span>Footer</span>}
        />
        <Skeleton shape="text" />
      </>,
    );
    expect(screen.getByRole("heading", { name: "Atelier Noir" })).toBeInTheDocument();
    expect(container.querySelector(".pa-skeleton")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});

it("data display has no axe violations", async () => {
  const { container } = render(
    <main>
      <Breadcrumb items={[{ label: "Docs", href: "/docs" }, { label: "Overview" }]} />
      <Card title="Card" description="Text" />
      <AvatarGroup>
        <Avatar name="Ali Moradi" status="online" />
        <Avatar name="Karen Ross" fallback="initials" />
      </AvatarGroup>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sort="none">Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Button</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Pagination page={2} count={10} />
      <Progress label="Upload" value={30} />
      <Skeleton />
    </main>,
  );
  await expectNoAxeViolations(container);
});
