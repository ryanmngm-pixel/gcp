
import { useCallback, useEffect, useState } from "react";
import {
  Check,
  CloudUpload,
  LoaderCircle,
  RefreshCcw,
  Save,
  ShieldCheck,
} from "lucide-react";

import PhotoSlotEditor from "./PhotoSlotEditor";
import SmartSlideshow from "../components/SmartSlideshow";
import { uploadPhotos } from "./uploadPhotos";

import {
  checkEditorAccess,
  getDraft,
  saveDraft,
  publishContent,
} from "./contentApi";

import "./MediaWorkspace.css";

const slots = [
  { key: "home_hero", label: "Homepage — Main showcase" },
  { key: "home_story", label: "Homepage — Our story" },
  { key: "home_gallery", label: "Homepage — Gallery preview" },
];

export default function MediaWorkspace() {
  const [selected, setSelected] = useState(slots[0].key);
  const [images, setImages] = useState([]);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async (key) => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const allowed = await checkEditorAccess();
      setAuthorized(allowed);

      if (!allowed) {
        setImages([]);
        return;
      }

      const draft = await getDraft(key);
      setImages(Array.isArray(draft) ? draft : []);
      setDirty(false);
    } catch (err) {
      setError(err.message || "Unable to load photographs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(selected);
  }, [load, selected]);

  function changeImages(next) {
    setImages(next);
    setDirty(true);
    setMessage("");
  }

  async function save() {
    setBusy(true);
    setError("");
    setMessage("");

    try {
      await saveDraft(selected, images);
      setDirty(false);
      setMessage("Draft saved successfully.");
    } catch (err) {
      setError(err.message || "Unable to save draft.");
    } finally {
      setBusy(false);
    }
  }

  async function publish() {
    setBusy(true);
    setError("");
    setMessage("");

    try {
      if (dirty) {
        await saveDraft(selected, images);
      }

      await publishContent(selected);

      setDirty(false);
      setMessage("Published successfully. The live site can now use these photos.");
    } catch (err) {
      setError(err.message || "Publishing failed.");
    } finally {
      setBusy(false);
    }
  }

  function changeSlot(key) {
    if (key === selected) return;

    if (dirty && !window.confirm(
      "You have unsaved changes. Discard them?"
    )) {
      return;
    }

    setSelected(key);
  }

  const currentSlot = slots.find((slot) => slot.key === selected);

  if (loading) {
    return (
      <div className="media-workspace-state">
        <LoaderCircle className="photo-spinner" size={26} />
        Loading media studio...
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="media-workspace-state">
        <ShieldCheck size={32} />
        <h2>Editor access required</h2>
        <p>Sign in with an authorized GCP editor account.</p>
      </div>
    );
  }

  return (
    <div className="media-workspace">
      <div className="media-workspace-header">
        <div>
          <span className="media-eyebrow">GCP STUDIO / MEDIA</span>
          <h1>Photography.</h1>
          <p>
            Every image tells a story. Make each one count.
          </p>
        </div>

        <div className="media-workspace-actions">
          <button
            type="button"
            className="media-secondary-button"
            disabled={busy}
            onClick={() => load(selected)}
          >
            <RefreshCcw size={16} />
            Reload
          </button>

          <button
            type="button"
            className="media-secondary-button"
            disabled={busy || !dirty}
            onClick={save}
          >
            <Save size={16} />
            Save draft
          </button>

          <button
            type="button"
            className="media-primary-button"
            disabled={busy}
            onClick={publish}
          >
            {busy ? (
              <LoaderCircle className="photo-spinner" size={16} />
            ) : (
              <CloudUpload size={16} />
            )}
            Publish
          </button>
        </div>
      </div>

      <div className="media-workspace-tabs">
        {slots.map((slot) => (
          <button
            key={slot.key}
            type="button"
            className={selected === slot.key ? "active" : ""}
            onClick={() => changeSlot(slot.key)}
          >
            {slot.label}
          </button>
        ))}
      </div>

      {dirty && (
        <div className="media-workspace-notice">
          You have unpublished changes in this editor.
        </div>
      )}

      {error && (
        <div className="media-workspace-error" role="alert">
          {error}
        </div>
      )}

      {message && (
        <div className="media-workspace-success" role="status">
          <Check size={16} />
          {message}
        </div>
      )}

      <PhotoSlotEditor
        label={currentSlot.label}
        images={images}
        onChange={changeImages}
        onUpload={uploadPhotos}
      />

      <div className="media-preview-section">
        <div className="media-preview-heading">
          <div>
            <span className="media-eyebrow">LIVE PREVIEW</span>
            <h2>See it in action.</h2>
          </div>
          <span>
            {images.length > 1
              ? `${images.length} photos · Slideshow`
              : images.length === 1
              ? "1 photo · Static"
              : "No photos selected"}
          </span>
        </div>

        <div className="media-preview-frame">
          <SmartSlideshow images={images} />
        </div>
      </div>
    </div>
  );
}
