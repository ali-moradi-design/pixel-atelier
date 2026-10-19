"use client";
import { Button } from "pixel-atelier/button";
import { NumberTicker } from "pixel-atelier/number-ticker";
import { useState } from "react";

export default function Demo() {
  const [n, setN] = useState(12840);
  return (
    <div className="flex items-baseline gap-5">
      <NumberTicker
        value={n}
        locale="en"
        className="text-5xl font-light tracking-tight"
      />
      <Button size="sm" onClick={() => setN(Math.round(Math.random() * 99999))}>
        Random
      </Button>
    </div>
  );
}
