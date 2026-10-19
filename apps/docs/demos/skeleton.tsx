import { Skeleton } from "pixel-atelier/skeleton";

export default function Demo() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading profile"
      className="flex w-full max-w-sm gap-3"
    >
      <Skeleton shape="square" className="size-12" />
      <div className="grid flex-1 content-start gap-2">
        <Skeleton shape="text" className="w-2/3" />
        <Skeleton shape="text" />
        <Skeleton shape="text" className="w-1/2" />
      </div>
    </div>
  );
}
