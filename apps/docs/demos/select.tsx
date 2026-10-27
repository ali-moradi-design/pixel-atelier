import { Field } from "pixelbits/field";
import { Select } from "pixelbits/select";

const frameworks = [
  { value: "astro", label: "Astro" },
  { value: "next", label: "Next.js", description: "React" },
  { value: "remix", label: "Remix", disabled: true },
  { value: "vite", label: "Vite" },
];

export default function Demo() {
  return (
    <Field label="Framework" className="w-full max-w-sm">
      <Select options={frameworks} defaultValue="next" />
    </Field>
  );
}
