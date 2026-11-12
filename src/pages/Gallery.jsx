
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Images,
  Pencil,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import InteriorPage from "../components/InteriorPage";
import SmartSlideshow from "../components/SmartSlideshow";
import { useOptionalVisualEditor } from "../dev/VisualEditorContext";
import { getPublished } from "../dev/contentApi";
import { uploadPhotos } from "../dev/uploadPhotos";
import "./Gallery.css";

const CONTENT_ID = "gallery_trips";

function makeId() {
  return crypto.randomUUID();
}

function normalizeTrips(value) {
  return Array.isArray(value) ? value : [];
}

function TripEditor({ trip, onSave, onClose }) {
  const [title, setTitle] = useState(trip?.title || "");
  const [description, setDescription] = useState(
    trip?.description || ""
  );
  const [photos, setPhotos] = useState(trip?.photos || []);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload(event) {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    setUploading(true);
    setError("");

    try {
      const uploaded = await uploadPhotos(files);

      if (!Array.isArray(uploaded)) {
        throw new Error("Photo uploader returned an invalid result.");
      }

      setPhotos((previous) => [...previous, ...uploaded]);
    } catch (err) {
      setError(err.message || "Photo upload failed.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function save(event) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Please enter a trip title.");
      return;
    }

    if (!photos.length) {
      setError("Please upload at least one photograph.");
      return;
    }

    onSave({
      id: trip?.id || makeId(),
      title: title.trim(),
      description: description.trim(),
      photos,
      createdAt: trip?.createdAt || new Date().toISOString(),
    });
  }

  return (
    <div className="gcp-trip-overlay" onClick={onClose}>
      <div
        className="gcp-trip-form"
        role="dialog"
        aria-modal="true"
        aria-label="Edit trip"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="gcp-trip-form-top">
          <div>
            <span>GCP STUDIO</span>
            <h2>{trip ? "Edit trip" : "Upload a trip"}</h2>
          </div>

          <button type="button" onClick={onClose} aria-label="Close">
            <X size={21} />
          </button>
        </div>

        <form onSubmit={save}>
          <label htmlFor="trip-title">Trip title</label>
          <input
            id="trip-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Summer Service Trip"
            maxLength={120}
            required
          />

          <label htmlFor="trip-description">Description</label>
          <textarea
            id="trip-description"
            rows={5}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Tell the story behind this trip..."
            maxLength={3000}
          />

          <div className="gcp-trip-upload-heading">
            <strong>Photographs</strong>
            <span>{photos.length} uploaded</span>
          </div>

          <label className="gcp-trip-upload">
            <Upload size={22} />
            <strong>
              {uploading ? "Uploading..." : "Add photographs"}
            </strong>
            <span>Choose multiple images at once</span>
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={uploading}
              onChange={handleUpload}
            />
          </label>

          {photos.length > 0 && (
            <div className="gcp-trip-upload-grid">
              {photos.map((photo, index) => (
                <div key={`${photo.url}-${index}`}>
                  <img
                    src={photo.url}
                    alt={photo.alt || `Photo ${index + 1}`}
                  />
                  <button
                    type="button"
                    aria-label={`Remove photo ${index + 1}`}
                    onClick={() =>
                      setPhotos((previous) =>
                        previous.filter((_, i) => i !== index)
                      )
                    }
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {error && (
            <p className="gcp-trip-error" role="alert">
              {error}
            </p>
          )}

          <div className="gcp-trip-form-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="primary"
            >
              Save trip
              <ArrowRight size={17} />
            </button>
          </div>

          <p className="gcp-trip-draft-note">
            Saving here updates your Studio draft. Use Publish in
            the visual editor to make changes public.
          </p>
        </form>
      </div>
    </div>
  );
}

function TripViewer({ trip, onClose }) {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="gcp-trip-overlay" onClick={onClose}>
      <div
        className="gcp-trip-viewer"
        role="dialog"
        aria-modal="true"
        aria-label={trip.title}
        onClick={(event) => event.stopPropagation()}
      >
        <header>
          <button type="button" onClick={onClose}>
            <ArrowLeft size={18} />
            Back to gallery
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close gallery"
          >
            <X size={23} />
          </button>
        </header>

        <div className="gcp-trip-viewer-body">
          <div className="gcp-trip-viewer-photo">
            <SmartSlideshow
              images={trip.photos}
              alt={trip.title}
            />
          </div>

          <div className="gcp-trip-viewer-details">
            <span>GCP PHOTO JOURNAL</span>
            <h2>{trip.title}</h2>
            {trip.description && <p>{trip.description}</p>}
            <div>
              <Images size={17} />
              {trip.photos.length} photographs
            </div>
          </div>

          <div className="gcp-trip-all-photos">
            {trip.photos.map((photo, index) => (
              <img
                key={`${photo.url}-${index}`}
                src={photo.url}
                alt={photo.alt || `${trip.title} photo ${index + 1}`}
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Gallery() {
  const editor = useOptionalVisualEditor();
  const editing = Boolean(editor && !editor.readOnly);

  const [publishedTrips, setPublishedTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [editingTrip, setEditingTrip] = useState(undefined);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editor) return;

    let mounted = true;

    getPublished("gallery_visual")
      .then((records) => {
        if (!mounted || !Array.isArray(records)) return;

        const record = records.find(
          (item) => item.id === CONTENT_ID
        );

        setPublishedTrips(normalizeTrips(record?.value));
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message || "Unable to load gallery.");
        }
      });

    return () => {
      mounted = false;
    };
  }, [editor]);

  const trips = editor
    ? normalizeTrips(editor.content?.[CONTENT_ID])
    : publishedTrips;

  function updateTrips(next) {
    editor.update(CONTENT_ID, next);
  }

  function saveTrip(trip) {
    const exists = trips.some((item) => item.id === trip.id);

    updateTrips(
      exists
        ? trips.map((item) =>
            item.id === trip.id ? trip : item
          )
        : [trip, ...trips]
    );

    setEditingTrip(undefined);
  }

  function deleteTrip(trip) {
    if (!window.confirm(`Delete "${trip.title}" from the draft?`)) {
      return;
    }

    updateTrips(trips.filter((item) => item.id !== trip.id));
  }

  return (
    <InteriorPage
      eyebrow="OUR GALLERY"
      title="Moments that matter."
      description="A visual look at the people, experiences, and communities that make this mission special."
    >
      <div className="gcp-gallery">
        <div className="gcp-gallery-heading">
          <div>
            <span>PHOTO JOURNAL</span>
            <h2>Our experiences.</h2>
          </div>

          {editing && (
            <button
              type="button"
              className="gcp-gallery-add"
              onClick={() => setEditingTrip(null)}
            >
              <Plus size={18} />
              Upload Trip
            </button>
          )}
        </div>

        {error && <p role="alert">{error}</p>}

        {!trips.length ? (
          <div className="gcp-gallery-empty">
            <Images size={32} />
            <h3>Stories are on their way.</h3>
            <p>
              {editing
                ? "Click Upload Trip to add the first photo collection."
                : "Check back soon for photographs from our trips."}
            </p>
          </div>
        ) : (
          <div className="gcp-gallery-grid">
            {trips.map((trip) => (
              <article className="gcp-gallery-card" key={trip.id}>
                <button
                  type="button"
                  className="gcp-gallery-card-open"
                  onClick={() => setSelectedTrip(trip)}
                >
                  <div className="gcp-gallery-card-photo">
                    <SmartSlideshow
                      images={trip.photos || []}
                      alt={trip.title}
                    />
                  </div>

                  <div className="gcp-gallery-card-copy">
                    <span>
                      {trip.photos?.length || 0} PHOTOGRAPHS
                    </span>
                    <h3>{trip.title}</h3>
                    {trip.description && (
                      <p>{trip.description}</p>
                    )}
                    <div>
                      Explore this trip
                      <ArrowRight size={17} />
                    </div>
                  </div>
                </button>

                {editing && (
                  <div className="gcp-gallery-card-admin">
                    <button
                      type="button"
                      onClick={() => setEditingTrip(trip)}
                    >
                      <Pencil size={15} /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteTrip(trip)}
                    >
                      <Trash2 size={15} /> Delete
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>

      {editingTrip !== undefined && editing && (
        <TripEditor
          trip={editingTrip}
          onSave={saveTrip}
          onClose={() => setEditingTrip(undefined)}
        />
      )}

      {selectedTrip && (
        <TripViewer
          trip={selectedTrip}
          onClose={() => setSelectedTrip(null)}
        />
      )}
    </InteriorPage>
  );
}
