import { Combobox } from "pixelbits/combobox";
import { Field } from "pixelbits/field";

const people = [
  "Aria Moradi",
  "Karen Ross",
  "Noah Kim",
  "Sara Ahmadi",
  "Leo Park",
  "Mina Rahimi",
].map((n) => ({
  value: n.toLowerCase().replace(" ", "-"),
  label: n,
}));

export default function Demo() {
  return (
    <Field label="Assignee" description="Type to filter" className="w-full max-w-sm">
      <Combobox options={people} placeholder="Search people" />
    </Field>
  );
}
