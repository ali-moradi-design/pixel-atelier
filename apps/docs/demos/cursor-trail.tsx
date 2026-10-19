"use client";
import { CursorTrail } from "pixel-atelier/cursor-trail";
import { Switch } from "pixel-atelier/switch";
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
