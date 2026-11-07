
import { useEffect, useRef, useState } from "react";
import Home from "./Home";
import {
  EditorProvider,
} from "../components/Editable";
import {
  CONTENT_STORAGE_KEY,
  cloneContent,
  defaultSiteContent,
  loadSiteContent,
} from "../content";
import "./Dev.css";

function setAtPath(object, path, value) {
  const next = cloneContent(object);
  let current = next;

  for (let i = 0; i < path.length - 1; i++) {
    current = current[path[i]];
  }

  current[path[path.length - 1]] = value;
  return next;
}

export default function Dev() {
  const [content, setContent] = useState(loadSiteContent);
  const [editing, setEditing] = useState(true);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [dirty, setDirty] = useState(false);
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const contentRef = useRef(content);

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  useEffect(() => {
    const warnBeforeLeaving = (event) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", warnBeforeLeaving);

    return () =>
      window.removeEventListener(
        "beforeunload",
        warnBeforeLeaving
      );
  }, [dirty]);

  function update(path, value) {
    const current = contentRef.current;
    const oldValue = path.reduce(
      (obj, key) => obj?.[key],
      current
    );

    if (oldValue === value) return;

    const next = setAtPath(current, path, value);

    contentRef.current = next;
    setHistory((items) => [...items.slice(-49), current]);
    setFuture([]);
    setContent(next);
    setDirty(true);
    setNotice("");
  }

  function undo() {
    if (!history.length) return;

    const previous = history[history.length - 1];

    setFuture((items) => [contentRef.current, ...items]);
    setHistory((items) => items.slice(0, -1));
    contentRef.current = previous;
    setContent(previous);
    setDirty(true);
  }

  function redo() {
    if (!future.length) return;

    const next = future[0];

    setHistory((items) => [...items, contentRef.current]);
    setFuture((items) => items.slice(1));
    contentRef.current = next;
    setContent(next);
    setDirty(true);
  }

  function save() {
    setSaving(true);

    try {
      localStorage.setItem(
        CONTENT_STORAGE_KEY,
        JSON.stringify(contentRef.current)
      );

      setDirty(false);
      setNotice("Changes saved in this browser.");
    } catch (error) {
      console.error(error);
      setNotice(
        "Save failed. Try smaller images or clear browser storage."
      );
    } finally {
      setSaving(false);
    }
  }

  function reset() {
    const confirmed = window.confirm(
      "Restore the original website content? You can undo this before saving."
    );

    if (!confirmed) return;

    const next = cloneContent(defaultSiteContent);

    setHistory((items) => [
      ...items.slice(-49),
      contentRef.current,
    ]);
    setFuture([]);
    contentRef.current = next;
    setContent(next);
    setDirty(true);
    setNotice("Original content restored. Save to keep it.");
  }

  function toggleEditing() {
    // Blur any active text field so its final value is committed.
    if (document.activeElement?.isContentEditable) {
      document.activeElement.blur();
    }

    setEditing((value) => !value);
  }

  return (
    <EditorProvider
      content={content}
      editing={editing}
      update={update}
    >
      <div
        className={`gcp-studio ${
          editing ? "gcp-studio-editing" : "gcp-studio-preview"
        }`}
      >
        <div className="gcp-studio-toolbar">
          <div className="gcp-studio-brand">
            <span className="gcp-studio-logo">G.</span>

            <div>
              <strong>GCP Studio</strong>
              <small>VISUAL WEBSITE EDITOR</small>
            </div>

            <span className="gcp-studio-mode">
              {editing ? "EDITING" : "PREVIEW"}
            </span>
          </div>

          <div className="gcp-studio-actions">
            <button
              type="button"
              onClick={undo}
              disabled={!history.length}
              title="Undo"
              aria-label="Undo"
            >
              ↶
            </button>

            <button
              type="button"
              onClick={redo}
              disabled={!future.length}
              title="Redo"
              aria-label="Redo"
            >
              ↷
            </button>

            <span className="gcp-toolbar-divider" />

            <button
              type="button"
              className="gcp-preview-button"
              onClick={toggleEditing}
            >
              {editing ? "◉ Preview" : "✎ Edit"}
            </button>

            <button
              type="button"
              className="gcp-save-button"
              onClick={save}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save changes"}
              {dirty && <span className="gcp-dirty-dot" />}
            </button>
          </div>
        </div>

        <div className="gcp-studio-utility">
          <div className="gcp-studio-instructions">
            <span className="gcp-instruction-dot" />
            {editing
              ? "Click text to edit · Click images to replace"
              : "Preview mode — editing controls hidden"}
          </div>

          <div className="gcp-studio-utility-actions">
            <button type="button" onClick={reset}>
              Reset
            </button>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Public site ↗
            </a>
          </div>
        </div>

        {notice && (
          <div className="gcp-studio-notice" role="status">
            {notice}
            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        <div className="gcp-studio-canvas">
          <Home />
        </div>
      </div>
    </EditorProvider>
  );
}
