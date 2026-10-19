"use client";
import { Button } from "pixel-atelier/button";
import { Checkbox } from "pixel-atelier/checkbox";
import { Dialog, DialogClose, Sheet } from "pixel-atelier/dialog";

export default function Demo() {
  return (
    <div className="flex gap-3">
      <Dialog
        trigger={<Button variant="primary">Publish</Button>}
        title="Publish component?"
        description="It will be added to the public registry on the next release."
        footer={
          <>
            <DialogClose asChild>
              <Button variant="ghost" size="sm">
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="primary" size="sm">
                Publish
              </Button>
            </DialogClose>
          </>
        }
      />
      <Sheet
        trigger={<Button>Filters</Button>}
        title="Filters"
        description="Narrow the list."
      >
        <div className="grid gap-2.5">
          <Checkbox label="Buttons" defaultChecked />
          <Checkbox label="Overlays" />
        </div>
      </Sheet>
    </div>
  );
}
