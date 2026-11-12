
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  CloudUpload,
  Eye,
  Image as ImageIcon,
  LoaderCircle,
  Monitor,
  RotateCcw,
  Save,
  Smartphone,
  Type,
} from "lucide-react";

import Home from "../pages/Home";
import About from "../pages/About";
import News from "../pages/News";
import Gallery from "../pages/Gallery";
import Contact from "../pages/Contact";

import PageTextLayer from "../components/PageTextLayer";
import PhotoSlotEditor from "./PhotoSlotEditor";
import { uploadPhotos } from "./uploadPhotos";

import {
  getDraft,
  saveDraft,
  publishContent,
} from "./contentApi";

import {
  EditorProvider,
  useVisualEditor,
} from "./VisualEditorContext";

import "./VisualEditor.css";

// Gallery's existing component and database key are
// retained to preserve previously uploaded trip content.
const PAGES = [
  {
    id: "home",
    label: "Home",
    component: Home,
    contentKey: "home_visual",
  },
  {
    id: "about",
    label: "Our Story",
    component: About,
    contentKey: "about_visual",
  },
  {
    id: "trips",
    label: "Trips",
    component: Gallery,
    contentKey: "gallery_visual",
  },
  {
    id: "news",
    label: "News",
    component: News,
    contentKey: "news_visual",
  },
  {
    id: "contact",
    label: "Contact",
    component: Contact,
    contentKey: "contact_visual",
  },
];

function EditorWorkspace({ onExit }) {
  const editor = useVisualEditor();

  const [pageId, setPageId] = useState("home");
  const [device, setDevice] = useState("desktop");

  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const page =
    PAGES.find((item) => item.id === pageId) ||
    PAGES[0];

  const Page = page.component;
  const contentKey = page.contentKey;

  useEffect(() => {
    let mounted = true;

    setLoading(true);
    setError("");
    setMessage("");

    async function loadPage() {
      try {
        const records = await getDraft(contentKey);

        if (!mounted) return;

        editor.loadContent(
          Array.isArray(records) ? records : []
        );
      } catch (err) {
        if (mounted) {
          setError(
            err.message ||
              "Unable to load this page's draft."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadPage();

    return () => {
      mounted = false;
    };

    // Reload the draft when changing pages.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentKey]);

  function changePage(nextPage) {
    if (nextPage === pageId || busy || loading) {
      return;
    }

    if (
      editor.dirty &&
      !window.confirm(
        "You have unsaved changes. Switch pages without saving?"
      )
    ) {
      return;
    }

    editor.select(null);
    setPageId(nextPage);
  }

  async function save() {
    if (busy || loading) return;

    setBusy(true);
    setError("");
    setMessage("");

    try {
      await saveDraft(
        contentKey,
        editor.serialize()
      );

      editor.markSaved();

      setMessage(
        `${page.label} draft saved successfully.`
      );
    } catch (err) {
      setError(
        err.message || "Unable to save draft."
      );
    } finally {
      setBusy(false);
    }
  }

  async function publish() {
    if (busy || loading) return;

    setBusy(true);
    setError("");
    setMessage("");

    try {
      await saveDraft(
        contentKey,
        editor.serialize()
      );

      await publishContent(contentKey);

      editor.markSaved();

      setMessage(
        `${page.label} published successfully.`
      );
    } catch (err) {
      setError(
        err.message || "Unable to publish page."
      );
    } finally {
      setBusy(false);
    }
  }

  async function resetDraft() {
    if (busy || loading) return;

    if (
      editor.dirty &&
      !window.confirm(
        "Discard your unsaved changes?"
      )
    ) {
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const records = await getDraft(
        contentKey
      );

      editor.loadContent(
        Array.isArray(records) ? records : []
      );

      setMessage("Saved draft reloaded.");
    } catch (err) {
      setError(
        err.message || "Unable to reload draft."
      );
    } finally {
      setLoading(false);
    }
  }

  function exit() {
    if (
      editor.dirty &&
      !window.confirm(
        "Leave the editor without saving?"
      )
    ) {
      return;
    }

    onExit();
  }

  const selected = editor.selected;

  const selectedValue = selected
    ? editor.content[selected.id] ??
      selected.fallback
    : null;

  const isTrips = pageId === "trips";

  return (
    <div className="gcp-visual-editor">
      <header className="visual-toolbar">
        <div className="visual-toolbar-left">
          <button
            type="button"
            className="visual-icon-button"
            onClick={exit}
            aria-label="Leave editor"
          >
            <ArrowLeft size={19} />
          </button>

          <div className="visual-toolbar-brand">
            <strong>GCP Studio</strong>
            <span>
              {page.label} / Visual editor
            </span>
          </div>
        </div>

        <div className="visual-device-switcher">
          <button
            type="button"
            className={
              device === "desktop" ? "active" : ""
            }
            onClick={() =>
              setDevice("desktop")
            }
            aria-label="Desktop preview"
          >
            <Monitor size={18} />
          </button>

          <button
            type="button"
            className={
              device === "mobile" ? "active" : ""
            }
            onClick={() =>
              setDevice("mobile")
            }
            aria-label="Mobile preview"
          >
            <Smartphone size={18} />
          </button>
        </div>

        <div className="visual-toolbar-actions">
          <span className="visual-save-status">
            {editor.dirty
              ? "Unsaved changes"
              : "No unsaved changes"}
          </span>

          <button
            type="button"
            className="visual-action-secondary"
            onClick={resetDraft}
            disabled={busy || loading}
            title="Reload saved draft"
          >
            <RotateCcw size={16} />
          </button>

          <button
            type="button"
            className="visual-action-secondary"
            onClick={save}
            disabled={
              busy ||
              loading ||
              !editor.dirty
            }
          >
            <Save size={16} />
            Save draft
          </button>

          <button
            type="button"
            className="visual-action-primary"
            onClick={publish}
            disabled={busy || loading}
          >
            {busy ? (
              <LoaderCircle
                size={16}
                className="studio-spin"
              />
            ) : (
              <CloudUpload size={16} />
            )}
            Publish
          </button>
        </div>
      </header>

      {(error || message) && (
        <div
          className={`visual-notification ${
            error ? "error" : ""
          }`}
          role={error ? "alert" : "status"}
        >
          {error || message}
        </div>
      )}

      <div className="visual-editor-layout">
        <aside className="visual-editor-sidebar">
          <div className="visual-sidebar-header">
            <span>PAGE EDITOR</span>

            <h2>{page.label}</h2>

            <label
              htmlFor="gcp-editor-page"
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Select page
            </label>

            <select
              id="gcp-editor-page"
              value={pageId}
              onChange={(event) =>
                changePage(event.target.value)
              }
              disabled={busy || loading}
              style={{
                width: "100%",
                padding: 13,
                borderRadius: 10,
                border: "1px solid #dedee3",
                background: "#fff",
                color: "#222",
                fontSize: 13,
              }}
            >
              {PAGES.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.label}
                </option>
              ))}
            </select>

            <p style={{ marginTop: 15 }}>
              {isTrips
                ? "Manage service trip collections, photographs, titles, and descriptions."
                : "Click a headline, paragraph, or editable photograph to make changes."}
            </p>
          </div>

          <div className="visual-sidebar-content">
            {!selected ? (
              <div className="visual-empty-selection">
                <Eye size={27} />

                <h3>
                  {isTrips
                    ? "Your trip collections"
                    : "Select an element"}
                </h3>

                <p>
                  {isTrips
                    ? "Click Upload Trip in the preview to create a collection. You can also edit or delete existing trips."
                    : "Select text or a photograph on the website preview. Your changes appear immediately."}
                </p>

                {isTrips && (
                  <p>
                    Save your draft when you're
                    finished, then select Publish
                    to update the public Trips page.
                  </p>
                )}
              </div>
            ) : (
              <>
                <div className="visual-selection-heading">
                  {selected.type === "text" ? (
                    <Type size={19} />
                  ) : (
                    <ImageIcon size={19} />
                  )}

                  <div>
                    <strong>
                      {selected.label}
                    </strong>

                    <span>
                      {selected.type === "text"
                        ? "Text element"
                        : "Photo collection"}
                    </span>
                  </div>
                </div>

                {selected.type === "text" && (
                  <div className="visual-field">
                    <label htmlFor="visual-text-input">
                      Content
                    </label>

                    <textarea
                      id="visual-text-input"
                      rows={7}
                      value={
                        typeof selectedValue ===
                        "string"
                          ? selectedValue
                          : ""
                      }
                      onChange={(event) =>
                        editor.update(
                          selected.id,
                          event.target.value
                        )
                      }
                    />

                    <p>
                      Changes appear immediately
                      in the preview. Save before
                      leaving this page.
                    </p>
                  </div>
                )}

                {selected.type === "image" && (
                  <PhotoSlotEditor
                    label={selected.label}
                    images={
                      Array.isArray(
                        selectedValue
                      )
                        ? selectedValue
                        : []
                    }
                    onChange={(images) =>
                      editor.update(
                        selected.id,
                        images
                      )
                    }
                    onUpload={uploadPhotos}
                  />
                )}
              </>
            )}
          </div>

          <div className="visual-sidebar-footer">
            <Check size={15} />
            Design and layout are protected
          </div>
        </aside>

        <main className="visual-canvas-area">
          {loading ? (
            <div className="visual-canvas-loading">
              <LoaderCircle
                className="studio-spin"
                size={25}
              />
              Loading {page.label}...
            </div>
          ) : (
            <div
              className={`visual-page-frame ${device}`}
            >
              <div className="visual-page-content">
                <PageTextLayer
                  pageId={pageId}
                >
                  <Page />
                </PageTextLayer>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function VisualEditor({
  onExit,
}) {
  return (
    <EditorProvider>
      <EditorWorkspace
        onExit={onExit}
      />
    </EditorProvider>
  );
}
