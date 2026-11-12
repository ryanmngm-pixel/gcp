
import { useEffect, useRef } from "react";

export default function ParallaxImage({
  src,
  alt,
  className = "",
}) {
  const container = useRef(null);
  const image = useRef(null);

  useEffect(() => {
    const element = container.current;
    const img = image.current;

    if (!element || !img) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    if (reducedMotion.matches) return;

    let frame = null;

    const update = () => {
      frame = null;

      const rect = element.getBoundingClientRect();
      const viewport = window.innerHeight;

      if (rect.bottom < 0 || rect.top > viewport) return;

      const progress =
        (viewport - rect.top) / (viewport + rect.height);

      const offset = (progress - 0.5) * 70;

      img.style.transform = `translate3d(0, ${offset}px, 0) scale(1.12)`;
    };

    const onScroll = () => {
      if (frame === null) {
        frame = requestAnimationFrame(update);
      }
    };

    update();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className={`parallax-image ${className}`} ref={container}>
      <img src={src} alt={alt} ref={image} loading="lazy" />
    </div>
  );
}
