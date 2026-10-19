import { Field } from "pixel-atelier/field";
import { Textarea } from "pixel-atelier/textarea";

export default function Demo() {
  return (
    <Field label="Message" description="Grows as you type." className="w-full max-w-sm">
      <Textarea autoResize placeholder="Tell us about the project…" />
    </Field>
  );
}
