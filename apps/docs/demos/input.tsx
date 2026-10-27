import { Field } from "pixelbits/field";
import { Input } from "pixelbits/input";

const Search = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export default function Demo() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      <Field label="Search">
        <Input
          start={<Search />}
          end={<kbd className="font-pb-mono text-[0.6875rem]">⌘K</kbd>}
          placeholder="Search components"
        />
      </Field>
      <Field label="Small">
        <Input size="sm" placeholder="Compact" />
      </Field>
    </div>
  );
}
