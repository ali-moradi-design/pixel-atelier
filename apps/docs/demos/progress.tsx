import { Progress } from "pixelbits/progress";

export default function Demo() {
  return (
    <div className="grid w-full max-w-md gap-5">
      <Progress label="Uploading assets" value={64} />
      <Progress label="Building registry" value={26} max={40} variant="pixel" />
      <Progress aria-label="Loading" />
    </div>
  );
}
