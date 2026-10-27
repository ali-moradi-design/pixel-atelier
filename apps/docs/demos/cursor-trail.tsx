"use client";
import { CursorTrail } from "pixelbits/cursor-trail";
import { Switch } from "pixelbits/switch";
import { useState } from "react";

export default function Demo() {
  const [on, setOn] = useState(false);
  return (
    <>
      <Switch label="Cursor trail on this page" checked={on} onCheckedChange={setOn} />
      {on && <CursorTrail />}
    </>
  );
}
