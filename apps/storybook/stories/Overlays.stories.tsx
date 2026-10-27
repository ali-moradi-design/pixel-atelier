import type { Meta, StoryObj } from "@storybook/react-vite";
import { Accordion, AccordionItem } from "pixelbits/accordion";
import { Button } from "pixelbits/button";
import { Checkbox } from "pixelbits/checkbox";
import { CommandPalette } from "pixelbits/command-palette";
import { Dialog, DialogClose, Sheet } from "pixelbits/dialog";
import {
  DropdownCheckboxItem,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
  DropdownSeparator,
} from "pixelbits/dropdown-menu";
import { IconButton } from "pixelbits/icon-button";
import { Input } from "pixelbits/input";
import { Popover } from "pixelbits/popover";
import { Tab, TabList, TabPanel, Tabs } from "pixelbits/tabs";
import { Toaster, toast } from "pixelbits/toast";
import { Tooltip } from "pixelbits/tooltip";
import { useState } from "react";

const meta = {
  title: "Core/Overlays",
  component: Dialog,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;

const Icon = ({ d }: { d: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);

export const TabsAndAccordion: Story = {
  render: () => (
    <div className="grid max-w-md gap-10">
      <Tabs defaultValue="preview">
        <TabList aria-label="Example">
          <Tab value="preview">Preview</Tab>
          <Tab value="code">Code</Tab>
          <Tab value="props">Props</Tab>
        </TabList>
        <TabPanel value="preview" className="text-sm text-pb-muted">
          The preview.
        </TabPanel>
        <TabPanel value="code" className="font-pb-mono text-xs">
          {"<Button />"}
        </TabPanel>
        <TabPanel value="props" className="text-sm">
          Props table
        </TabPanel>
      </Tabs>
      <Tabs defaultValue="dark" variant="segmented">
        <TabList aria-label="Theme">
          <Tab value="dark">Dark</Tab>
          <Tab value="light">Light</Tab>
          <Tab value="system">System</Tab>
        </TabList>
      </Tabs>
      <Accordion>
        <AccordionItem title="Is it accessible?" defaultOpen>
          Yes. Every effect also runs on keyboard focus.
        </AccordionItem>
        <AccordionItem title="Can I change the accent?">
          Set data-accent on any element.
        </AccordionItem>
        <AccordionItem title="Does it support RTL?">
          Yes, with logical properties.
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const DialogStory: Story = {
  name: "Dialog",
  render: () => (
    <Dialog
      defaultOpen
      trigger={<Button variant="primary">Publish</Button>}
      title="Publish component?"
      description="It will be added to the public registry and the npm package on the next release."
      footer={
        <>
          <DialogClose asChild>
            <Button variant="ghost" size="sm">
              Cancel
            </Button>
          </DialogClose>
          <Button variant="primary" size="sm">
            Publish
          </Button>
        </>
      }
    />
  ),
};

export const SheetStory: Story = {
  name: "Sheet",
  render: () => (
    <Sheet
      defaultOpen
      trigger={<Button>Filters</Button>}
      title="Filters"
      description="Narrow the list."
    >
      <div className="grid gap-2.5">
        <Checkbox label="Buttons" defaultChecked />
        <Checkbox label="Overlays" defaultChecked />
        <Checkbox label="Forms" />
      </div>
    </Sheet>
  ),
};

export const PopoverTooltipMenu: Story = {
  render: function Render() {
    const [grid, setGrid] = useState(true);
    return (
      <div className="flex items-start gap-4">
        <Tooltip content="Copy to clipboard">
          <IconButton aria-label="Copy">
            <Icon d="M8 8h12v12H8zM16 8V4H4v12h4" />
          </IconButton>
        </Tooltip>
        <Popover trigger={<Button>Share</Button>} title="Share link">
          <p className="mb-2.5 text-pb-muted">Anyone with the link can view.</p>
          <Input readOnly value="pb.dev/s/9x2" size="sm" />
        </Popover>
        <DropdownMenu defaultOpen trigger={<Button>Account</Button>}>
          <DropdownLabel>ali@studio</DropdownLabel>
          <DropdownItem
            icon={
              <Icon d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
            }
            shortcut="⇧ P"
          >
            Profile
          </DropdownItem>
          <DropdownItem
            icon={
              <Icon d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 2v3M12 19v3M2 12h3M19 12h3" />
            }
            shortcut="⌘ ,"
          >
            Settings
          </DropdownItem>
          <DropdownCheckboxItem checked={grid} onCheckedChange={setGrid}>
            Show grid
          </DropdownCheckboxItem>
          <DropdownSeparator />
          <DropdownItem
            variant="danger"
            icon={<Icon d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h11" />}
          >
            Sign out
          </DropdownItem>
        </DropdownMenu>
      </div>
    );
  },
};

export const Command: Story = {
  render: () => (
    <>
      <p className="text-sm text-pb-muted">Press ⌘K / Ctrl+K.</p>
      <CommandPalette
        defaultOpen
        commands={[
          { id: "1", label: "Pixel button", group: "Components", onSelect: () => {} },
          {
            id: "2",
            label: "Pixel image reveal",
            group: "Components",
            onSelect: () => {},
          },
          { id: "3", label: "Pixel loader", group: "Components", onSelect: () => {} },
          {
            id: "4",
            label: "Switch to light theme",
            group: "Actions",
            shortcut: "⌘ L",
            onSelect: () => {},
          },
          {
            id: "5",
            label: "Copy install command",
            group: "Actions",
            onSelect: () => {},
          },
        ]}
      />
    </>
  ),
};

export const Toasts: Story = {
  render: () => (
    <div className="flex gap-3">
      <Toaster />
      <Button
        onClick={() =>
          toast({
            title: "Copied to clipboard",
            description: "pnpm add pixelbits",
            variant: "success",
          })
        }
      >
        Success
      </Button>
      <Button
        onClick={() =>
          toast({
            title: "Upload failed",
            description: "The file is larger than 5 MB.",
            variant: "danger",
            action: { label: "Retry", onClick: () => {} },
            duration: Number.POSITIVE_INFINITY,
          })
        }
      >
        Error
      </Button>
      <Button
        onClick={() =>
          toast({
            title: "New version available",
            description: "v1.2 adds the marquee.",
            variant: "info",
          })
        }
      >
        Info
      </Button>
    </div>
  ),
};
