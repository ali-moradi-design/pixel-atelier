import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "pixelbits/button";
import { IconButton } from "pixelbits/icon-button";
import { expect, userEvent, within } from "storybook/test";

const meta = {
  title: "Core/Button",
  component: Button,
  args: { children: "Get started", variant: "secondary", size: "md" },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["primary", "secondary", "ghost", "danger"],
    },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary">Get started</Button>
      <Button>Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Delete</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="sm">Small</Button>
      <Button>Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button data-px-active="">Forced active</Button>
      <Button disabled>Disabled</Button>
      <Button variant="primary" loading>
        Saving
      </Button>
      <Button pixel={false}>No pixels</Button>
    </div>
  ),
};

export const IconButtons: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <IconButton aria-label="Add" size="sm">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </IconButton>
      <IconButton aria-label="Add">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </IconButton>
      <IconButton aria-label="Add" size="lg" variant="primary">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </IconButton>
    </div>
  ),
};

export const AsLink: Story = {
  render: () => (
    <Button asChild variant="primary">
      <a href="#start">Start a project</a>
    </Button>
  ),
};

/** Keyboard focus runs the same dissolve as hover. */
export const KeyboardFocus: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    const button = canvas.getByRole("button");
    await expect(button).toHaveFocus();
    await expect(
      button.querySelector("[data-pb-pixels]")?.childElementCount,
    ).toBeGreaterThan(0);
  },
};
