
import { useOptionalVisualEditor } from "../dev/VisualEditorContext";

export default function EditableText({
  id,
  label,
  fallback = "",
  as: Tag = "span",
  className = "",
}) {
  const editor = useOptionalVisualEditor();

  const savedValue = editor?.content?.[id];

  const value =
    typeof savedValue === "string"
      ? savedValue
      : fallback;

  if (!editor || editor.readOnly) {
    return (
      <Tag className={className}>
        {value}
      </Tag>
    );
  }

  const active = editor.selected?.id === id;

  function select(event) {
    event?.preventDefault();
    event?.stopPropagation();

    editor.select({
      id,
      label,
      type: "text",
      fallback,
    });
  }

  return (
    <Tag
      className={`visual-editable-text ${className} ${
        active ? "visual-selected" : ""
      }`}
      role="button"
      tabIndex={0}
      aria-label={`Edit ${label}`}
      onClick={select}
      onKeyDown={(event) => {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          select(event);
        }
      }}
    >
      {value}
    </Tag>
  );
}
