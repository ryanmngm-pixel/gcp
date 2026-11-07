
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const EditorContext = createContext(null);

export function EditorProvider({
  children,
  content,
  editing,
  update,
}) {
  return (
    <EditorContext.Provider
      value={{ content, editing, update }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useSiteContent() {
  const editor = useContext(EditorContext);

  if (!editor) {
    throw new Error("Site content provider is missing.");
  }

  return editor.content;
}

export function useEditor() {
  return useContext(EditorContext);
}

function getAtPath(obj, path) {
  return path.reduce((current, key) => current?.[key], obj);
}

export function EditableText({
  path,
  as: Tag = "span",
  className = "",
  ...props
}) {
  const editor = useEditor();
  const value = String(getAtPath(editor.content, path) ?? "");
  const ref = useRef(null);
  const focused = useRef(false);

  useEffect(() => {
    if (ref.current && !focused.current) {
      if (ref.current.textContent !== value) {
        ref.current.textContent = value;
      }
    }
  }, [value]);

  const editable = editor.editing;

  return (
    <Tag
      {...props}
      ref={ref}
      className={`${className} ${
        editable ? "gcp-editable-text" : ""
      }`}
      contentEditable={editable ? "plaintext-only" : undefined}
      suppressContentEditableWarning
      spellCheck={editable}
      role={editable ? "textbox" : undefined}
      aria-label={
        editable
          ? `Edit ${path.join(" ")}`
          : undefined
      }
      tabIndex={editable ? 0 : undefined}
      onFocus={() => {
        focused.current = true;
      }}
      onBlur={(event) => {
        focused.current = false;

        if (editable) {
          editor.update(
            path,
            event.currentTarget.textContent ?? ""
          );
        }
      }}
      onKeyDown={(event) => {
        if (editable && event.key === "Escape") {
          event.currentTarget.textContent = value;
          event.currentTarget.blur();
        }
      }}
    >
      {value}
    </Tag>
  );
}

export function EditableImage({
  path,
  alt = "",
  label = "CHANGE IMAGE",
  className = "",
  priority = false,
}) {
  const editor = useEditor();
  const inputRef = useRef(null);
  const [error, setError] = useState("");
  const src = getAtPath(editor.content, path) || "";
  const editable = editor.editing;

  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Choose a JPG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be under 2 MB for local editing.");
      event.target.value = "";
      return;
    }

    setError("");

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        editor.update(path, reader.result);
      }
    };

    reader.onerror = () => {
      setError("Unable to read this image.");
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  }

  return (
    <div
      className={`image-frame gcp-image-slot ${className} ${
        editable ? "gcp-editable-image" : ""
      }`}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
        />
      ) : (
        <div className="image-artwork" aria-label={alt}>
          <div className="artwork-sun" />
          <div className="artwork-ridge ridge-back" />
          <div className="artwork-ridge ridge-front" />
          <div className="artwork-grain" />
          <div className="image-placeholder-label">
            <span className="placeholder-line" />
            <span>{label}</span>
          </div>
        </div>
      )}

      {editable && (
        <>
          <button
            type="button"
            className="gcp-image-edit-button"
            onClick={() => inputRef.current?.click()}
          >
            <span>↥</span>
            Replace photo
          </button>

          {src && (
            <button
              type="button"
              className="gcp-image-remove-button"
              onClick={() => editor.update(path, "")}
            >
              Remove
            </button>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFile}
            hidden
          />

          {error && (
            <div className="gcp-image-error" role="alert">
              {error}
            </div>
          )}
        </>
      )}
    </div>
  );
}
