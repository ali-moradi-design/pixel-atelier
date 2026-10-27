"use client";
import { Checkbox } from "pixelbits/checkbox";
import { useState } from "react";

export default function Demo() {
  const [items, setItems] = useState([true, false]);
  const all = items.every(Boolean);
  return (
    <div className="grid gap-2.5">
      <Checkbox
        label="Select all"
        checked={all}
        indeterminate={items.some(Boolean) && !all}
        onCheckedChange={(c) => setItems(items.map(() => c))}
      />
      {["Email notifications", "Weekly digest"].map((l, i) => (
        <Checkbox
          key={l}
          label={l}
          checked={items[i]}
          onCheckedChange={(c) => setItems(items.map((v, j) => (j === i ? c : v)))}
        />
      ))}
    </div>
  );
}
