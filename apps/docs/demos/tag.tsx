"use client";
import { Tag } from "pixel-atelier/tag";
import { useState } from "react";

export default function Demo() {
  const [tags, setTags] = useState(["react", "tailwind v4", "native dialog"]);
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((t) => (
        <Tag key={t} onRemove={() => setTags((all) => all.filter((x) => x !== t))}>
          {t}
        </Tag>
      ))}
    </div>
  );
}
