import EditableImage from "./EditableImage";

export default function InteriorPage({
  eyebrow,
  title,
  description,
  photo,
  children,
}) {
  return (
    <>
      <section className={`interior-hero${photo ? " interior-hero-photo" : ""}`}>
        <div className="container interior-hero-layout">
          <div className="interior-hero-copy">
            <span className="eyebrow">{eyebrow}</span>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          {photo && (
            <EditableImage
              id={photo.id}
              label={eyebrow + " header photograph"}
              fallback={[photo]}
              className="gcp-editorial-image"
              parallax={false}
            />
          )}
        </div>
      </section>
      <section className="container interior-content">{children}</section>
    </>
  );
}
