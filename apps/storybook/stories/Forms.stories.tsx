import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "pixelbits/checkbox";
import { Combobox } from "pixelbits/combobox";
import { Field } from "pixelbits/field";
import { Input } from "pixelbits/input";
import { Radio, RadioGroup } from "pixelbits/radio";
import { Select } from "pixelbits/select";
import { Slider } from "pixelbits/slider";
import { Switch } from "pixelbits/switch";
import { Textarea } from "pixelbits/textarea";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";

const meta = {
  title: "Core/Forms",
  component: Field,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Field>;
export default meta;
type Story = StoryObj<typeof meta>;

const search = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);
const frameworks = [
  { value: "astro", label: "Astro" },
  { value: "next", label: "Next.js", description: "React" },
  { value: "remix", label: "Remix", disabled: true },
  { value: "vite", label: "Vite" },
  { value: "nuxt", label: "Nuxt", description: "Vue" },
  { value: "svelte", label: "SvelteKit" },
];
const people = [
  "Aria Moradi",
  "Karen Ross",
  "Noah Kim",
  "Sara Ahmadi",
  "Leo Park",
  "Mina Rahimi",
  "Omar Haddad",
].map((n) => ({ value: n.toLowerCase().replace(" ", "-"), label: n }));

export const TextFields: Story = {
  args: { label: "", children: null },
  render: () => (
    <div className="grid max-w-sm gap-5">
      <Field label="Email" description="We never share it." required>
        <Input type="email" placeholder="you@studio.com" />
      </Field>
      <Field label="Website" error="Enter a valid address.">
        <Input defaultValue="studio,com" />
      </Field>
      <Field label="Search">
        <Input
          start={search}
          end={<kbd className="font-pb-mono text-[0.6875rem]">⌘K</kbd>}
          placeholder="Search components"
        />
      </Field>
      <Field label="Message">
        <Textarea autoResize placeholder="Tell us about the project…" />
      </Field>
      <Field label="Disabled" disabled>
        <Input defaultValue="Read only for now" />
      </Field>
    </div>
  ),
};

export const Choices: Story = {
  args: { label: "", children: null },
  render: function Render() {
    const [all, setAll] = useState<boolean[]>([true, false]);
    const every = all.every(Boolean);
    const some = all.some(Boolean);
    return (
      <div className="grid max-w-sm gap-6">
        <div className="grid gap-2.5">
          <Checkbox
            label="Select all"
            checked={every}
            indeterminate={some && !every}
            onCheckedChange={(c) => setAll(all.map(() => c))}
          />
          {["Email notifications", "Weekly digest"].map((l, i) => (
            <Checkbox
              key={l}
              label={l}
              checked={all[i]}
              onCheckedChange={(c) => setAll(all.map((v, j) => (j === i ? c : v)))}
            />
          ))}
        </div>
        <RadioGroup aria-label="Billing" defaultValue="monthly">
          <Radio value="monthly" label="Monthly" />
          <Radio value="yearly" label="Yearly" description="Two months free" />
        </RadioGroup>
        <div className="grid gap-2.5">
          <Switch label="Reduced motion" defaultChecked />
          <Switch label="Compact density" size="sm" />
        </div>
        <Field label="Pixel size">
          <Slider min={4} max={16} defaultValue={9} />
        </Field>
        <Field label="Steps">
          <Slider min={0} max={5} defaultValue={2} ticks />
        </Field>
      </div>
    );
  },
};

export const Selects: Story = {
  args: { label: "", children: null },
  render: () => (
    <div className="grid max-w-sm gap-5">
      <Field label="Framework">
        <Select options={frameworks} defaultValue="next" />
      </Field>
      <Field label="Assignee" description="Type to filter">
        <Combobox options={people} start={search} placeholder="Search people" />
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const select = canvas.getByRole("combobox", { name: "Framework" });
    await userEvent.click(select);
    await userEvent.keyboard("{ArrowDown}{Enter}");
    await expect(select).toHaveTextContent("Vite");
  },
};
