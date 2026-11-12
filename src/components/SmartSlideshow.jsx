
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./SmartSlideshow.css";

export default function SmartSlideshow({
  images = [],
  interval = 6000,
  className = "",
  alt = "Guatemala Children's Project",
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [ratios, setRatios] = useState({});
  const [reducedMotion, setReducedMotion] = useState(false);

  const slides = images
    .filter((image) =>
      typeof image === "string" ? image : image?.url
    )
    .map((image) =>
      typeof image === "string"
        ? { url: image, alt }
        : image
    );

  const count = slides.length;
  const current = Math.min(active, Math.max(count - 1, 0));
  const currentImage = slides[current];

  useEffect(() => {
    const query = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const update = () => setReducedMotion(query.matches);
    update();

    query.addEventListener?.("change", update);

    return () => {
      query.removeEventListener?.("change", update);
    };
  }, []);

  useEffect(() => {
    if (count < 2 || paused || reducedMotion) return;

    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        setActive((previous) => (previous + 1) % count);
      }
    }, interval);

    return () => window.clearInterval(timer);
  }, [count, interval, paused, reducedMotion]);

  function changeSlide(direction) {
    if (!count) return;

    setActive(
      (previous) => (previous + direction + count) % count
    );
  }

  function recordDimensions(src, event) {
    const image = event.currentTarget;

    if (!image.naturalWidth || !image.naturalHeight) return;

    const ratio = image.naturalWidth / image.naturalHeight;

    setRatios((previous) => {
      if (previous[src] === ratio) return previous;

      return {
        ...previous,
        [src]: ratio,
      };
    });
  }

  if (!count) {
    return (
      <div className={`smart-slideshow empty ${className}`} />
    );
  }

  const ratio = ratios[currentImage.url] || 1.5;

  return (
    <div
      className={`smart-slideshow ${className}`}
      style={{ aspectRatio: ratio }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (
          !event.currentTarget.contains(event.relatedTarget)
        ) {
          setPaused(false);
        }
      }}
      aria-label={alt}
    >
      {slides.map((image, index) => (
        <img
          key={`${image.url}-${index}`}
          src={image.url}
          alt={image.alt || alt}
          className={`smart-slide ${
            index === current ? "active" : ""
          }`}
          loading={index === 0 ? "eager" : "lazy"}
          onLoad={(event) =>
            recordDimensions(image.url, event)
          }
          aria-hidden={index !== current}
        />
      ))}

      {count > 1 && (
        <>
          <button
            type="button"
            className="slide-arrow previous"
            onClick={(event) => {
              event.stopPropagation();
              changeSlide(-1);
            }}
            aria-label="Previous photograph"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            className="slide-arrow next"
            onClick={(event) => {
              event.stopPropagation();
              changeSlide(1);
            }}
            aria-label="Next photograph"
          >
            <ChevronRight size={20} />
          </button>

          <div
            className="slide-dots"
            aria-label="Choose photograph"
          >
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`slide-dot ${
                  index === current ? "active" : ""
                }`}
                onClick={(event) => {
                  event.stopPropagation();
                  setActive(index);
                }}
                aria-label={`Show photograph ${index + 1}`}
                aria-current={
                  index === current ? "true" : undefined
                }
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
