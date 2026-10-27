"use client";
import { Badge } from "pixelbits/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "pixelbits/table";
import { useState } from "react";

const rows = [
  ["Pixel button", "Signature", 2.0],
  ["Command palette", "Overlay", 3.2],
  ["Select", "Form", 3.9],
] as const;

export default function Demo() {
  const [asc, setAsc] = useState(true);
  const sorted = [...rows].sort((a, b) => (asc ? a[2] - b[2] : b[2] - a[2]));
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Component</TableHead>
          <TableHead>Group</TableHead>
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
        {sorted.map((r) => (
          <TableRow key={r[0]}>
            <TableCell>{r[0]}</TableCell>
            <TableCell>
              <Badge>{r[1]}</Badge>
            </TableCell>
            <TableCell numeric>{r[2].toFixed(1)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
