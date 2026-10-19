import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { expectNoAxeViolations } from "../../test/axe.ts";
import { Accordion, AccordionItem } from "./accordion.tsx";
import { Button } from "./button.tsx";
import { CommandPalette } from "./command-palette.tsx";
import { Dialog, DialogClose, Sheet } from "./dialog.tsx";
import {
  DropdownCheckboxItem,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
  DropdownSeparator,
} from "./dropdown-menu.tsx";
import { Popover } from "./popover.tsx";
import { Tab, TabList, TabPanel, Tabs } from "./tabs.tsx";
import { dismissToast, Toaster, toast } from "./toast.tsx";
import { Tooltip } from "./tooltip.tsx";

describe("Tabs", () => {
  const ui = (
    <Tabs defaultValue="preview">
      <TabList aria-label="Example">
        <Tab value="preview">Preview</Tab>
        <Tab value="code">Code</Tab>
        <Tab value="props">Props</Tab>
      </TabList>
      <TabPanel value="preview">Preview panel</TabPanel>
      <TabPanel value="code">Code panel</TabPanel>
      <TabPanel value="props">Props panel</TabPanel>
    </Tabs>
  );
  it("links tabs and panels and switches on click", async () => {
    render(ui);
    expect(screen.getByRole("tabpanel")).toHaveAccessibleName("Preview");
    await userEvent.click(screen.getByRole("tab", { name: "Code" }));
    expect(screen.getByRole("tab", { name: "Code" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Code panel");
  });
  it("moves with arrow keys and has one tab stop", async () => {
    render(ui);
    await userEvent.tab();
    expect(screen.getByRole("tab", { name: "Preview" })).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Code" })).toHaveFocus();
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Code panel");
    await userEvent.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "Props" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Preview" })).toHaveFocus();
    expect(screen.getAllByRole("tab").filter((t) => t.tabIndex === 0)).toHaveLength(1);
  });
});

describe("Accordion", () => {
  it("uses exclusive native details in single mode", () => {
    const { container } = render(
      <Accordion>
        <AccordionItem title="One" defaultOpen>
          First
        </AccordionItem>
        <AccordionItem title="Two">Second</AccordionItem>
      </Accordion>,
    );
    const details = container.querySelectorAll("details");
    expect(details[0]).toHaveAttribute("open");
    expect(details[0]?.getAttribute("name")).toBeTruthy();
    expect(details[0]?.getAttribute("name")).toBe(details[1]?.getAttribute("name"));
  });
  it("has independent items in multiple mode", () => {
    const { container } = render(
      <Accordion type="multiple">
        <AccordionItem title="One">First</AccordionItem>
      </Accordion>,
    );
    expect(container.querySelector("details")).not.toHaveAttribute("name");
  });
});

describe("Dialog and Sheet", () => {
  it("opens from its trigger, is labelled, and closes", async () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog
        trigger={<Button>Publish</Button>}
        title="Publish component?"
        description="It will be public."
        onOpenChange={onOpenChange}
        footer={
          <DialogClose asChild>
            <Button>Cancel</Button>
          </DialogClose>
        }
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Publish" }));
    const dialog = screen.getByRole("dialog", { name: "Publish component?" });
    expect(dialog).toHaveAttribute("open");
    expect(dialog).toHaveAccessibleDescription("It will be public.");
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(dialog).not.toHaveAttribute("open");
  });
  it("closes on Escape (cancel) and with the close button", async () => {
    render(<Sheet defaultOpen title="Filters" side="start" />);
    const sheet = screen.getByRole("dialog", { name: "Filters" });
    expect(sheet).toHaveAttribute("data-side", "start");
    fireEvent(sheet, new Event("cancel", { cancelable: true }));
    expect(sheet).not.toHaveAttribute("open");
  });
  it("closes with the × button", async () => {
    render(<Dialog defaultOpen title="Hello" />);
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.getByRole("dialog", { hidden: true })).not.toHaveAttribute("open");
  });
});

describe("Popover and Tooltip", () => {
  it("toggles from the trigger and closes on Escape and outside press", async () => {
    render(
      <>
        <Popover trigger={<Button>Share</Button>} title="Share link">
          Anyone with the link can view.
        </Popover>
        <p>outside</p>
      </>,
    );
    const trigger = screen.getByRole("button", { name: "Share" });
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("dialog", { name: "Share link" })).toBeVisible();
    await userEvent.keyboard("{Escape}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(trigger);
    await userEvent.click(screen.getByText("outside"));
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
  it("shows a tooltip on focus and describes its element", async () => {
    render(
      <Tooltip content="Copy to clipboard">
        <button type="button">Copy</button>
      </Tooltip>,
    );
    await userEvent.tab();
    await waitFor(() => expect(screen.getByRole("tooltip")).toBeVisible());
    expect(screen.getByRole("button")).toHaveAccessibleDescription("Copy to clipboard");
    await userEvent.tab();
    expect(screen.getByRole("tooltip", { hidden: true })).not.toBeVisible();
  });
});

describe("DropdownMenu", () => {
  function Menu({ onSettings }: { onSettings: () => void }) {
    const [grid, setGrid] = useState(false);
    return (
      <DropdownMenu trigger={<Button>Account</Button>}>
        <DropdownLabel>ali@studio</DropdownLabel>
        <DropdownItem>Profile</DropdownItem>
        <DropdownItem disabled>Billing</DropdownItem>
        <DropdownItem shortcut="⌘ ," onSelect={onSettings}>
          Settings
        </DropdownItem>
        <DropdownCheckboxItem checked={grid} onCheckedChange={setGrid}>
          Show grid
        </DropdownCheckboxItem>
        <DropdownSeparator />
        <DropdownItem variant="danger">Sign out</DropdownItem>
      </DropdownMenu>
    );
  }
  it("opens on ArrowDown, skips disabled items, runs with Enter", async () => {
    const onSettings = vi.fn();
    render(<Menu onSettings={onSettings} />);
    const trigger = screen.getByRole("button", { name: "Account" });
    trigger.focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Profile" })).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: /Settings/ })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(onSettings).toHaveBeenCalledOnce();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });
  it("toggles a checkbox item and closes on Escape", async () => {
    render(<Menu onSettings={() => {}} />);
    const trigger = screen.getByRole("button", { name: "Account" });
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole("menuitemcheckbox", { name: "Show grid" }));
    await userEvent.click(trigger);
    expect(screen.getByRole("menuitemcheckbox", { name: "Show grid" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    await userEvent.keyboard("{Escape}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });
  it("jumps by typing", async () => {
    render(<Menu onSettings={() => {}} />);
    await userEvent.click(screen.getByRole("button", { name: "Account" }));
    await userEvent.keyboard("si");
    expect(screen.getByRole("menuitem", { name: "Sign out" })).toHaveFocus();
  });
});

describe("CommandPalette", () => {
  it("opens with mod+k, filters by words and runs with Enter", async () => {
    const onTheme = vi.fn();
    render(
      <CommandPalette
        commands={[
          { id: "a", label: "Pixel button", group: "Components", onSelect: () => {} },
          {
            id: "b",
            label: "Switch to light theme",
            group: "Actions",
            keywords: ["mode"],
            onSelect: onTheme,
          },
        ]}
      />,
    );
    await userEvent.keyboard("{Control>}k{/Control}");
    const input = screen.getByRole("combobox", { name: "Command palette" });
    await userEvent.type(input, "light mode");
    expect(screen.getAllByRole("option")).toHaveLength(1);
    await userEvent.keyboard("{Enter}");
    expect(onTheme).toHaveBeenCalledOnce();
  });
});

describe("Toast", () => {
  afterEach(() => act(() => dismissToast()));
  it("shows toasts in a live region and dismisses them", async () => {
    render(<Toaster />);
    const undo = vi.fn();
    act(() => {
      toast({ title: "Copied", variant: "success" });
      toast({ title: "Deleted", action: { label: "Undo", onClick: undo } });
    });
    expect(screen.getByRole("list", { name: "Notifications" })).toHaveAttribute(
      "aria-live",
      "polite",
    );
    expect(screen.getByText("Copied")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Undo" }));
    expect(undo).toHaveBeenCalledOnce();
    expect(screen.queryByText("Deleted")).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(screen.queryByText("Copied")).toBeNull();
  });
  it("hides itself after its duration", () => {
    vi.useFakeTimers();
    render(<Toaster />);
    act(() => {
      toast({ title: "Saved", duration: 1000 });
    });
    expect(screen.getByText("Saved")).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1100));
    expect(screen.queryByText("Saved")).toBeNull();
    vi.useRealTimers();
  });
});

it("overlays have no axe violations when open", async () => {
  const { container } = render(
    <div>
      <Tabs defaultValue="a">
        <TabList aria-label="Tabs">
          <Tab value="a">A</Tab>
          <Tab value="b">B</Tab>
        </TabList>
        <TabPanel value="a">Panel</TabPanel>
      </Tabs>
      <Accordion>
        <AccordionItem title="Question">Answer</AccordionItem>
      </Accordion>
      <Dialog defaultOpen title="Title" description="Text" />
      <DropdownMenu defaultOpen trigger={<Button>Menu</Button>}>
        <DropdownItem>Item</DropdownItem>
      </DropdownMenu>
    </div>,
  );
  await expectNoAxeViolations(container);
});
