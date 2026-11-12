
import { useEffect, useState } from "react";
import SmartSlideshow from "./SmartSlideshow";
import { getPublished } from "../dev/contentApi";

export default function PublishedSlideshow({
  slot,
  fallback = [],
  className = "",
}) {
  const [images, setImages] = useState(fallback);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const published = await getPublished(slot);

        if (active && Array.isArray(published) && published.length) {
          setImages(published);
        }
      } catch (error) {
        console.error("Unable to load published photographs:", error);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [slot]);

  return (
    <SmartSlideshow
      images={images}
      className={className}
    />
  );
}
