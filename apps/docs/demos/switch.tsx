import { Switch } from "pixelbits/switch";

export default function Demo() {
  return (
    <div className="grid gap-3">
      <Switch label="Reduced motion" defaultChecked />
      <Switch label="Compact density" size="sm" />
    </div>
  );
}
