import { SITE_NAME } from "../config";

// CSS sizes and crops the logo (object-fit: cover); width/height give the browser its aspect ratio up front.
// The AVIF is resized to cover the largest rendered box at 2x; the PNG is the fallback.
export default function Logo({ className, lazy = false }) {
  return (
    <picture>
      <source type="image/avif" srcSet="/images/aeromed-logo-336.avif" />
      <img
        className={className}
        src="/images/aeromed-logo.png"
        alt={SITE_NAME}
        width="631"
        height="316"
        loading={lazy ? "lazy" : undefined}
        decoding="async"
      />
    </picture>
  );
}
