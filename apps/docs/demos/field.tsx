import { Field } from "pixelbits/field";
import { Input } from "pixelbits/input";

export default function Demo() {
  return (
    <div className="grid w-full max-w-sm gap-5">
      <Field label="Email" description="We never share it." required>
        <Input type="email" placeholder="you@studio.com" />
      </Field>
      <Field label="Website" error="Enter a valid address.">
        <Input defaultValue="studio,com" />
      </Field>
    </div>
  );
}
