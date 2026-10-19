import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, AvatarGroup } from "pixel-atelier/avatar";
import { Badge } from "pixel-atelier/badge";
import { Breadcrumb } from "pixel-atelier/breadcrumb";
import { Card } from "pixel-atelier/card";
import { Pagination } from "pixel-atelier/pagination";
import { Progress } from "pixel-atelier/progress";
import { Skeleton } from "pixel-atelier/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "pixel-atelier/table";
import { useState } from "react";

const meta = {
  title: "Core/Data display",
  component: Card,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

const art = (
  <svg
    viewBox="0 0 400 160"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    className="h-32 w-full"
  >
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1d1a2b" />
        <stop offset="0.6" stopColor="#7a4a3a" />
        <stop offset="1" stopColor="#e2a36a" />
      </linearGradient>
    </defs>
    <rect width="400" height="160" fill="url(#sky)" />
    <circle cx="270" cy="88" r="26" fill="#f6d39a" />
    <path d="M0 110 Q100 80 200 112 T400 100 V160 H0Z" fill="#24181f" />
  </svg>
);

export const Cards: Story = {
  render: () => (
    <div className="grid max-w-3xl grid-cols-2 gap-4">
      <Card
        media={art}
        eyebrow="Case study"
        title="Atelier Noir"
        description="A fashion house site built on the kit."
        interactive
      />
      <Card
        title="Pixel button"
        description="The signature hover dissolve."
        footer={
          <Badge variant="success" dot>
            Stable
          </Badge>
        }
      />
    </div>
  ),
};

export const PeopleAndLoading: Story = {
  render: () => (
    <div className="grid max-w-md gap-6">
      <div className="flex items-center gap-3">
        <Avatar name="Ali Moradi" size="lg" status="online" />
        <div>
          <div className="text-sm font-medium">Ali Moradi</div>
          <div className="text-xs text-pa-muted">Design engineer</div>
        </div>
        <AvatarGroup className="ms-auto" max={3}>
          <Avatar name="Karen Ross" fallback="initials" />
          <Avatar name="Noah Kim" />
          <Avatar name="Sara Ahmadi" />
          <Avatar name="Leo Park" />
        </AvatarGroup>
      </div>
      <div aria-busy="true" className="flex gap-3">
        <Skeleton shape="square" className="size-12" />
        <div className="grid flex-1 content-start gap-2">
          <Skeleton shape="text" className="w-2/3" />
          <Skeleton shape="text" />
          <Skeleton shape="text" className="w-1/2" />
        </div>
      </div>
      <Progress label="Uploading assets" value={64} />
      <Progress label="Building registry" value={26} max={40} variant="pixel" />
      <Progress aria-label="Loading" />
    </div>
  ),
};

const rows = [
  ["Pixel button", "Signature", "Stable", 2.0],
  ["Command palette", "Overlay", "Stable", 3.2],
  ["Image reveal", "Signature", "Beta", 2.2],
  ["Combobox", "Form", "Stable", 3.7],
] as const;

export const TableAndNavigation: Story = {
  render: function Render() {
    const [asc, setAsc] = useState(true);
    const [page, setPage] = useState(2);
    const sorted = [...rows].sort((a, b) => (asc ? a[3] - b[3] : b[3] - a[3]));
    return (
      <div className="grid max-w-2xl gap-5">
        <Breadcrumb
          items={[
            { label: "Docs", href: "#" },
            { label: "Components", href: "#" },
            { label: "Overview" },
          ]}
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Component</TableHead>
              <TableHead>Group</TableHead>
              <TableHead>Status</TableHead>
              <TableHead
                numeric
                sort={asc ? "ascending" : "descending"}
                onSort={() => setAsc(!asc)}
              >
                kB
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((r, i) => (
              <TableRow key={r[0]} selected={i === 1}>
                <TableCell>{r[0]}</TableCell>
                <TableCell className="text-pa-muted">{r[1]}</TableCell>
                <TableCell>
                  <Badge variant={r[2] === "Stable" ? "success" : "warning"} dot>
                    {r[2]}
                  </Badge>
                </TableCell>
                <TableCell numeric>{r[3].toFixed(1)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination page={page} count={12} onPageChange={setPage} />
      </div>
    );
  },
};
