import { Field } from "pixel-atelier/field";
import { Slider } from "pixel-atelier/slider";

export default function Demo() {
  return (
    <div className="grid w-full max-w-sm gap-5">
      <Field label="Pixel size">
        <Slider min={4} max={16} defaultValue={9} />
      </Field>
      <Field label="Steps">
        <Slider min={0} max={5} defaultValue={2} ticks />
      </Field>
    </div>
  );
}
