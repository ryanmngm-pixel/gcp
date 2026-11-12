
import { useRef, useState } from "react";
import {
  Upload,
  Trash2,
  ArrowUp,
  ArrowDown,
  Images,
  LoaderCircle,
} from "lucide-react";
import "./PhotoSlotEditor.css";

export default function PhotoSlotEditor({
  label = "Photo collection",
  images = [],
  onChange,
  onUpload,
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(event) {
    const files = Array.from(event.target.files || []);
    event.target.value = "";

    if (!files.length || uploading) return;

    if (typeof onUpload !== "function") {
      setError("Photo uploading has not been configured.");
      return;
    }

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/avif"];

    if (files.some((file) => !allowed.includes(file.type))) {
      setError("Please choose JPG, PNG, WebP, or AVIF photographs.");
      return;
    }

    if (files.some((file) => file.size > 10 * 1024 * 1024)) {
      setError("Each photograph must be 10 MB or smaller.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const uploaded = await onUpload(files);
      if (!Array.isArray(uploaded)) {
        throw new Error("The uploader returned an invalid result.");
      }
      onChange([...images, ...uploaded]);
    } catch (err) {
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function remove(index) {
    onChange(images.filter((_, position) => position !== index));
  }

  function move(index, direction) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= images.length) return;

    const updated = [...images];
    [updated[index], updated[nextIndex]] = [
      updated[nextIndex],
      updated[index],
    ];

    onChange(updated);
  }

  function updateAlt(index, alt) {
    onChange(
      images.map((image, position) =>
        position === index
          ? { ...image, alt }
          : image
      )
    );
  }

  return (
    <section className="photo-editor">
      <div className="photo-editor-heading">
        <div>
          <h3>{label}</h3>
          <p>
            {images.length} photograph{images.length === 1 ? "" : "s"}
            {" · "}
            {images.length > 1
              ? "Automatic slideshow"
              : "Static image"}
          </p>
        </div>
        <Images size={22} />
      </div>

      <div className="photo-editor-grid">
        {images.map((image, index) => (
          <div className="photo-editor-item" key={image.id || image.url || index}>
            <div className="photo-editor-thumbnail">
              <img src={image.url} alt={image.alt || ""} />

              <button
                type="button"
                className="photo-remove"
                onClick={() => remove(index)}
                aria-label={`Remove photograph ${index + 1}`}
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="photo-editor-item-bottom">
              <span>Photo {index + 1}</span>
              <div>
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                  aria-label="Move photograph earlier"
                >
                  <ArrowUp size={15} />
                </button>
                <button
                  type="button"
                  disabled={index === images.length - 1}
                  onClick={() => move(index, 1)}
                  aria-label="Move photograph later"
                >
                  <ArrowDown size={15} />
                </button>
              </div>
            </div>

            <input
              type="text"
              value={image.alt || ""}
              onChange={(event) => updateAlt(index, event.target.value)}
              placeholder="Describe this photograph"
              aria-label={`Description for photograph ${index + 1}`}
            />
          </div>
        ))}

        <button
          type="button"
          className="photo-add"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <LoaderCircle className="photo-spinner" size={25} />
          ) : (
            <Upload size={25} />
          )}
          <strong>{uploading ? "Uploading..." : "Add photographs"}</strong>
          <span>Select multiple at once</span>
        </button>
      </div>

      {error && <p className="photo-editor-error" role="alert">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        hidden
        onChange={handleFiles}
      />
    </section>
  );
}
