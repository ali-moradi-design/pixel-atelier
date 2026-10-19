"use client";
import { Button } from "pixel-atelier/button";
import {
  DropdownCheckboxItem,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
  DropdownSeparator,
} from "pixel-atelier/dropdown-menu";
import { useState } from "react";

export default function Demo() {
  const [grid, setGrid] = useState(true);
  return (
    <DropdownMenu trigger={<Button>Account</Button>}>
      <DropdownLabel>ali@studio</DropdownLabel>
      <DropdownItem shortcut="⇧ P">Profile</DropdownItem>
      <DropdownItem shortcut="⌘ ,">Settings</DropdownItem>
      <DropdownCheckboxItem checked={grid} onCheckedChange={setGrid}>
        Show grid
      </DropdownCheckboxItem>
      <DropdownSeparator />
      <DropdownItem variant="danger">Sign out</DropdownItem>
    </DropdownMenu>
  );
}
