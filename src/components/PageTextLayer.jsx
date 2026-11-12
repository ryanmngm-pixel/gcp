
import { useEffect, useRef } from "react";
import { useOptionalVisualEditor } from "../dev/VisualEditorContext";

const SELECTOR = "h1, h2, h3, h4, p";

export default function PageTextLayer({
  pageId,
  children,
}) {
  const root = useRef(null);
  const editor = useOptionalVisualEditor();

  const editing = Boolean(editor && !editor.readOnly);
  const content = editor?.content;

  useEffect(() => {
    const element = root.current;
    if (!element) return;

    const targets = Array.from(
      element.querySelectorAll(SELECTOR)
    ).filter(
      (node) =>
        !node.closest(".gcp-gallery") &&
        !node.closest(".visual-editable-text")
    );

    targets.forEach((node, index) => {
      const id = `${pageId}_text_${index}`;

      if (!node.dataset.gcpOriginalText) {
        node.dataset.gcpOriginalText = node.textContent || "";
      }

      const value = content?.[id];

      if (typeof value === "string") {
        node.textContent = value;
      }

      if (editing) {
        node.dataset.gcpEditable = "true";
        node.tabIndex = 0;
        node.setAttribute("role", "button");
        node.setAttribute("aria-label", `Edit ${node.tagName.toLowerCase()} text`);
      }
    });

    function handleClick(event) {
      if (!editing) return;

      const target = event.target.closest(
        "[data-gcp-editable='true']"
      );

      if (!target || !element.contains(target)) return;

      const index = targets.indexOf(target);
      if (index < 0) return;

      event.preventDefault();
      event.stopPropagation();

      editor.select({
        id: `${pageId}_text_${index}`,
        label: `${pageId} — Text ${index + 1}`,
        type: "text",
        fallback: target.dataset.gcpOriginalText || "",
      });
    }

    element.addEventListener("click", handleClick);

    return () => {
      element.removeEventListener("click", handleClick);
    };
  }, [pageId, editing, content, editor]);

  return (
    <div
      ref={root}
      className={editing ? "gcp-page-text-editing" : ""}
    >
      {children}
    </div>
  );
}
