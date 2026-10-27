"use client";
import { Button } from "pixelbits/button";
import { toast } from "pixelbits/toast";

export default function Demo() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={() =>
          toast({
            title: "Copied to clipboard",
            description: "pnpm add pixelbits",
            variant: "success",
          })
        }
      >
        Success
      </Button>
      <Button
        onClick={() =>
          toast({
            title: "Upload failed",
            description: "The file is over 5 MB.",
            variant: "danger",
            action: { label: "Retry", onClick: () => {} },
          })
        }
      >
        Error
      </Button>
    </div>
  );
}
