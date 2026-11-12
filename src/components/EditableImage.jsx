
import ParallaxImage from "./ParallaxImage";
import SmartSlideshow from "./SmartSlideshow";
import { useOptionalVisualEditor } from "../dev/VisualEditorContext";

export default function EditableImage({
  id,
  label,
  fallback = [],
  className = "",
  imageClassName = "",
  parallax = true,
}) {
  const editor = useOptionalVisualEditor();

  const savedImages = editor?.content?.[id];

  const images = Array.isArray(savedImages)
    ? savedImages
    : fallback;

  const validImages = images.filter(
    (image) =>
      typeof image === "string" ||
      (image && typeof image.url === "string")
  );

  const isEditor = Boolean(editor && !editor.readOnly);
  const selected = editor?.selected?.id === id;

  function renderImage() {
    if (!validImages.length) {
      return (
        <div
          style={{
            aspectRatio: "3 / 2",
            background: "#f0f0f2",
            borderRadius: "inherit",
          }}
        />
      );
    }

    if (validImages.length > 1) {
      return (
        <SmartSlideshow
          images={validImages}
          alt={label}
        />
      );
    }

    const image = validImages[0];

    const src =
      typeof image === "string" ? image : image.url;

    const alt =
      typeof image === "string"
        ? label
        : image.alt || label;

    if (parallax && !isEditor) {
      return (
        <ParallaxImage
          src={src}
          alt={alt}
          className={imageClassName}
        />
      );
    }

    return (
      <img
        src={src}
        alt={alt}
        className={imageClassName}
        style={{
          display: "block",
          width: "100%",
          height: "auto",
          maxHeight: "none",
          objectFit: "contain",
          borderRadius: "inherit",
        }}
      />
    );
  }

  if (!isEditor) {
    return (
      <div className={`gcp-adaptive-image ${className}`}>
        {renderImage()}
      </div>
    );
  }

  function select(event) {
    event.preventDefault();
    event.stopPropagation();

    editor.select({
      id,
      label,
      type: "image",
      fallback,
    });
  }

  return (
    <div
      className={`gcp-adaptive-image visual-editable-image ${className} ${
        selected ? "visual-selected" : ""
      }`}
      role="button"
      tabIndex={0}
      aria-label={`Edit ${label}`}
      onClick={select}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          select(event);
        }
      }}
      style={{
        height: "auto",
        minHeight: 0,
      }}
    >
      {renderImage()}

      <div className="visual-image-overlay">
        ✦ Click to edit photos
      </div>
    </div>
  );
}
