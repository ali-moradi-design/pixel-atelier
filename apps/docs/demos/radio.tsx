import { Radio, RadioGroup } from "pixelbits/radio";

export default function Demo() {
  return (
    <RadioGroup aria-label="Billing" defaultValue="monthly">
      <Radio value="monthly" label="Monthly" />
      <Radio value="yearly" label="Yearly" description="Two months free" />
    </RadioGroup>
  );
}
