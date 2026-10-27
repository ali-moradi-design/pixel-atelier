import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  type AnchorHTMLAttributes,
  createRef,
  forwardRef,
  type ReactElement,
} from "react";
import * as kit from "../src/index.ts";

const {
  Accordion,
  AccordionItem,
  Avatar,
  AvatarGroup,
  Badge,
  Breadcrumb,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardEyebrow,
  CardFooter,
  CardHeader,
  CardMedia,
  CardTitle,
  Checkbox,
  Combobox,
  CommandPalette,
  CursorTrail,
  Dialog,
  DialogClose,
  DropdownMenu,
  DropdownCheckboxItem,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  FeatureGrid,
  Field,
  FullScreenMenu,
  Hero,
  IconButton,
  Input,
  Magnetic,
  Marquee,
  NumberTicker,
  Pagination,
  PixelIdenticon,
  PixelImageReveal,
  PixelLoader,
  PixelSpinner,
  PixelTransition,
  Pixels,
  Popover,
  Pricing,
  Progress,
  Radio,
  RadioGroup,
  RollLabel,
  Select,
  Sheet,
  SiteFooter,
  SiteHeader,
  Skeleton,
  Slider,
  SpotlightCard,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  Tag,
  TextLink,
  TextScramble,
  Textarea,
  Toaster,
  Tooltip,
} = kit;

const C = "pb-test-class";
const opts = [{ value: "a", label: "A" }];

// One element per exported component, each with className={C}. A component
// that drops className (or puts it nowhere) fails here.
const cases: [string, ReactElement][] = [
  [
    "Accordion",
    <Accordion key="" className={C}>
      <AccordionItem title="T">x</AccordionItem>
    </Accordion>,
  ],
  [
    "AccordionItem",
    <AccordionItem key="" className={C} title="T">
      x
    </AccordionItem>,
  ],
  ["Avatar", <Avatar key="" className={C} name="Ali Moradi" />],
  [
    "AvatarGroup",
    <AvatarGroup key="" className={C}>
      <Avatar name="A B" />
    </AvatarGroup>,
  ],
  ["PixelIdenticon", <PixelIdenticon key="" className={C} seed="x" />],
  [
    "Badge",
    <Badge key="" className={C}>
      b
    </Badge>,
  ],
  ["Breadcrumb", <Breadcrumb key="" className={C} items={[{ label: "Home" }]} />],
  [
    "Button",
    <Button key="" className={C}>
      b
    </Button>,
  ],
  ["Card", <Card key="" className={C} title="t" />],
  ["CardMedia", <CardMedia key="" className={C} />],
  ["CardHeader", <CardHeader key="" className={C} />],
  ["CardEyebrow", <CardEyebrow key="" className={C} />],
  [
    "CardTitle",
    <CardTitle key="" className={C}>
      t
    </CardTitle>,
  ],
  ["CardDescription", <CardDescription key="" className={C} />],
  ["CardContent", <CardContent key="" className={C} />],
  ["CardFooter", <CardFooter key="" className={C} />],
  ["Checkbox", <Checkbox key="" className={C} label="c" />],
  ["Combobox", <Combobox key="" className={C} aria-label="c" options={opts} />],
  ["CommandPalette", <CommandPalette key="" className={C} defaultOpen commands={[]} />],
  ["CursorTrail", <CursorTrail key="" className={C} />],
  ["Dialog", <Dialog key="" className={C} defaultOpen title="d" />],
  ["Sheet", <Sheet key="" className={C} defaultOpen title="d" />],
  [
    "DialogClose",
    <DialogClose key="" className={C}>
      x
    </DialogClose>,
  ],
  [
    "DropdownMenu",
    <DropdownMenu key="" className={C} trigger={<button type="button">m</button>}>
      <DropdownItem>i</DropdownItem>
    </DropdownMenu>,
  ],
  [
    "DropdownItem",
    <DropdownMenu key="" defaultOpen trigger={<button type="button">m</button>}>
      <DropdownItem className={C}>i</DropdownItem>
    </DropdownMenu>,
  ],
  [
    "DropdownCheckboxItem",
    <DropdownMenu key="" defaultOpen trigger={<button type="button">m</button>}>
      <DropdownCheckboxItem className={C} checked={false} onCheckedChange={() => {}}>
        i
      </DropdownCheckboxItem>
    </DropdownMenu>,
  ],
  [
    "DropdownLabel",
    <DropdownMenu key="" defaultOpen trigger={<button type="button">m</button>}>
      <DropdownLabel className={C}>l</DropdownLabel>
    </DropdownMenu>,
  ],
  [
    "DropdownSeparator",
    <DropdownMenu key="" defaultOpen trigger={<button type="button">m</button>}>
      <DropdownSeparator className={C} />
    </DropdownMenu>,
  ],
  [
    "Field",
    <Field key="" className={C} label="f">
      <Input />
    </Field>,
  ],
  [
    "FullScreenMenu",
    <FullScreenMenu
      key=""
      className={C}
      defaultOpen
      links={[]}
      trigger={<button type="button">m</button>}
    />,
  ],
  [
    "IconButton",
    <IconButton key="" className={C} aria-label="i">
      i
    </IconButton>,
  ],
  ["PixelImageReveal", <PixelImageReveal key="" className={C} src="/a.png" alt="" />],
  ["Input", <Input key="" className={C} aria-label="i" />],
  [
    "Magnetic",
    <Magnetic key="" className={C}>
      <button type="button">m</button>
    </Magnetic>,
  ],
  [
    "Marquee",
    <Marquee key="" className={C}>
      m
    </Marquee>,
  ],
  ["NumberTicker", <NumberTicker key="" className={C} value={3} />],
  ["PixelTransition", <PixelTransition key="" className={C} />],
  ["Pagination", <Pagination key="" className={C} page={1} count={3} />],
  ["PixelLoader", <PixelLoader key="" className={C} />],
  [
    "Popover",
    <Popover key="" className={C} trigger={<button type="button">p</button>}>
      p
    </Popover>,
  ],
  ["Progress", <Progress key="" className={C} value={3} aria-label="p" />],
  [
    "RadioGroup",
    <RadioGroup key="" className={C} aria-label="r">
      <Radio value="a" label="a" />
    </RadioGroup>,
  ],
  [
    "Radio",
    <RadioGroup key="" aria-label="r">
      <Radio className={C} value="a" label="a" />
    </RadioGroup>,
  ],
  ["Select", <Select key="" className={C} aria-label="s" options={opts} />],
  ["Skeleton", <Skeleton key="" className={C} />],
  ["Slider", <Slider key="" className={C} aria-label="s" />],
  ["SpotlightCard", <SpotlightCard key="" className={C} />],
  ["Switch", <Switch key="" className={C} label="s" />],
  [
    "Table",
    <Table key="" className={C}>
      <TableBody>
        <TableRow>
          <TableCell>c</TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  ],
  [
    "TableHeader",
    <table key="">
      <TableHeader className={C}>
        <TableRow>
          <TableHead>h</TableHead>
        </TableRow>
      </TableHeader>
    </table>,
  ],
  [
    "TableBody",
    <table key="">
      <TableBody className={C} />
    </table>,
  ],
  [
    "TableRow",
    <table key="">
      <tbody>
        <TableRow className={C} />
      </tbody>
    </table>,
  ],
  [
    "TableHead",
    <table key="">
      <thead>
        <tr>
          <TableHead className={C}>h</TableHead>
        </tr>
      </thead>
    </table>,
  ],
  [
    "TableCell",
    <table key="">
      <tbody>
        <tr>
          <TableCell className={C}>c</TableCell>
        </tr>
      </tbody>
    </table>,
  ],
  [
    "Tabs",
    <Tabs key="" className={C} defaultValue="a">
      <TabList>
        <Tab value="a">a</Tab>
      </TabList>
      <TabPanel value="a">p</TabPanel>
    </Tabs>,
  ],
  [
    "TabList",
    <Tabs key="" defaultValue="a">
      <TabList className={C}>
        <Tab value="a">a</Tab>
      </TabList>
    </Tabs>,
  ],
  [
    "Tab",
    <Tabs key="" defaultValue="a">
      <TabList>
        <Tab className={C} value="a">
          a
        </Tab>
      </TabList>
    </Tabs>,
  ],
  [
    "TabPanel",
    <Tabs key="" defaultValue="a">
      <TabPanel className={C} value="a">
        p
      </TabPanel>
    </Tabs>,
  ],
  [
    "Tag",
    <Tag key="" className={C}>
      t
    </Tag>,
  ],
  [
    "TextLink",
    <TextLink key="" className={C} href="/">
      l
    </TextLink>,
  ],
  ["TextScramble", <TextScramble key="" className={C} text="t" />],
  ["Textarea", <Textarea key="" className={C} aria-label="t" />],
  ["Toaster", <Toaster key="" className={C} />],
  [
    "Tooltip",
    <Tooltip key="" className={C} content="t">
      <button type="button">t</button>
    </Tooltip>,
  ],
  ["FeatureGrid", <FeatureGrid key="" className={C} features={[]} />],
  ["Hero", <Hero key="" className={C} title="h" />],
  ["Pricing", <Pricing key="" className={C} plans={[]} />],
  ["SiteFooter", <SiteFooter key="" className={C} brand="b" />],
  ["SiteHeader", <SiteHeader key="" className={C} brand="b" links={[]} />],
  ["PixelSpinner", <PixelSpinner key="" className={C} />],
  [
    "Pixels",
    <span key="" className="pb-px-host">
      <Pixels className={C} />
    </span>,
  ],
  [
    "RollLabel",
    <RollLabel key="" className={C}>
      r
    </RollLabel>,
  ],
];

describe("every component accepts className", () => {
  it("covers every exported component", () => {
    const exported = Object.keys(kit).filter(
      (k) => /^[A-Z]/.test(k) && typeof (kit as Record<string, unknown>)[k] !== "string",
    );
    const tested = new Set(cases.map(([n]) => n));
    expect(exported.filter((k) => !tested.has(k))).toEqual([]);
  });
  it.each(cases)("%s", (_, el) => {
    render(el);
    // Popovers and dialogs may render into the top layer, so look everywhere.
    expect(document.querySelector(`.${C}`)).not.toBeNull();
  });
});

/** Stands in for Next.js <Link>: a function component that forwards its ref. */
const RouterLink = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(
  function RouterLink(props, ref) {
    return <a ref={ref} data-router="" {...props} />;
  },
);

describe("asChild", () => {
  it("Button renders a router link with merged classes, handlers and ref", async () => {
    const ref = createRef<HTMLButtonElement>();
    const onParent = vi.fn();
    const onChild = vi.fn();
    render(
      <Button
        asChild
        ref={ref}
        variant="primary"
        className="from-button"
        onClick={onParent}
      >
        <RouterLink href="/docs" className="from-child" onClick={onChild}>
          Docs
        </RouterLink>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Docs" });
    expect(link).toHaveAttribute("data-router");
    expect(link).toHaveAttribute("href", "/docs");
    expect(link.className).toMatch(/from-button/);
    expect(link.className).toMatch(/from-child/);
    expect(link.className).toMatch(/bg-pb-accent/);
    expect(link).not.toHaveAttribute("type");
    expect(ref.current).toBe(link);
    // The pixel squares and the label both live inside the link.
    expect(link.querySelector("[data-pb-pixels]")).not.toBeNull();
    await userEvent.click(link);
    expect(onChild).toHaveBeenCalledOnce();
    expect(onParent).toHaveBeenCalledOnce();
  });

  it("Button asChild with loading keeps the spinner inside the child", () => {
    render(
      <Button asChild loading>
        <RouterLink href="/x">Go</RouterLink>
      </Button>,
    );
    const link = screen.getByRole("link", { name: /Go/ });
    expect(link).toHaveAttribute("aria-busy", "true");
    expect(link.querySelector('[role="status"]')).not.toBeNull();
  });

  it("IconButton passes asChild through", () => {
    render(
      <IconButton asChild aria-label="Home">
        <RouterLink href="/">⌂</RouterLink>
      </IconButton>,
    );
    expect(screen.getByRole("link", { name: "Home" })).toHaveClass("size-10");
  });

  it("TextLink styles a router link and forwards the ref", () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <TextLink asChild variant="pixel" ref={ref}>
        <RouterLink href="/about">About</RouterLink>
      </TextLink>,
    );
    const link = screen.getByRole("link", { name: "About" });
    expect(link).toHaveClass("pb-link-px");
    expect(ref.current).toBe(link);
  });

  it("DialogClose asChild closes the dialog and keeps the child's handler", async () => {
    const onClick = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <Dialog defaultOpen title="Publish" onOpenChange={onOpenChange}>
        <DialogClose asChild className="extra">
          <Button onClick={onClick}>Cancel</Button>
        </DialogClose>
      </Dialog>,
    );
    const btn = screen.getByRole("button", { name: "Cancel" });
    expect(btn).toHaveClass("extra");
    await userEvent.click(btn);
    expect(onClick).toHaveBeenCalledOnce();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("Pricing renders a link CTA through Button asChild", () => {
    render(
      <Pricing
        plans={[
          {
            name: "Pro",
            price: "$9",
            features: [],
            cta: { label: "Buy", href: "/buy" },
          },
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: /Buy/ })).toHaveAttribute("href", "/buy");
  });
});
