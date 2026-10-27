import { PixelImageReveal } from "pixelbits/image-reveal";

const sunset = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d1a2b"/><stop offset=".55" stop-color="#7a4a3a"/><stop offset="1" stop-color="#e2a36a"/></linearGradient></defs><rect width="400" height="500" fill="url(#g)"/><circle cx="265" cy="260" r="70" fill="#f6d39a"/><path d="M0 330 Q100 280 200 335 T400 320 V500 H0Z" fill="#3b2730"/><path d="M0 400 Q140 360 260 405 T400 395 V500 H0Z" fill="#120d11"/></svg>',
)}`;

export default function Demo() {
  return (
    <div className="grid w-full max-w-md grid-cols-2 gap-4">
      <PixelImageReveal
        src={sunset}
        alt="Sunset over hills"
        wrapperClassName="aspect-4/5 rounded-pb-sm"
      />
      <PixelImageReveal
        src={sunset}
        alt="Sunset, revealed on hover"
        trigger="hover"
        wrapperClassName="aspect-4/5 rounded-pb-sm"
      />
    </div>
  );
}
