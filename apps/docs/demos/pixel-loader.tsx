import { PixelLoader } from "pixel-atelier/pixel-loader";

export default function Demo() {
  return (
    <div className="flex items-center gap-10">
      <PixelLoader />
      <PixelLoader variant="pulse" size={10} />
      <PixelLoader variant="noise" />
    </div>
  );
}
