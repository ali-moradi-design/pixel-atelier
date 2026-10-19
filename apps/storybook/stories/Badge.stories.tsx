import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "pixel-atelier/badge";
import { Link } from "pixel-atelier/link";
import { Tag } from "pixel-atelier/tag";
import { useState } from "react";

const meta = { title: "Core/Link, Badge, Tag", component: Badge } satisfies Meta<
  typeof Badge
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Badges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>Default</Badge>
      <Badge variant="accent" dot>
        New
      </Badge>
      <Badge variant="success" dot>
        Live
      </Badge>
      <Badge variant="warning">Beta</Badge>
      <Badge variant="danger">Deprecated</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="solid">v1.0</Badge>
    </div>
  ),
};

export const Links: Story = {
  render: () => (
    <p className="text-sm">
      Read the <Link href="#guide">installation guide</Link>, browse{" "}
      <Link variant="pixel" href="#all">
        all components
      </Link>{" "}
      or{" "}
      <Link variant="plain" href="#home">
        go home
      </Link>
      .
    </p>
  ),
};

function TagsDemo() {
  const [tags, setTags] = useState(["react", "tailwind v4", "radix"]);
  return (
    <div className="flex gap-2">
      {tags.map((t) => (
        <Tag key={t} onRemove={() => setTags((all) => all.filter((x) => x !== t))}>
          {t}
        </Tag>
      ))}
    </div>
  );
}
export const Tags: Story = { render: () => <TagsDemo /> };
