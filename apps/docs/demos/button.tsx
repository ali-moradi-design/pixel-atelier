"use client";
import { Button } from "pixelbits/button";

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary">Get started</Button>
      <Button>Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Delete</Button>
      <Button roll>Rolling label</Button>
      <Button loading>Saving</Button>
    </div>
  );
}
