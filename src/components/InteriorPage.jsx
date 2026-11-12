
export default function InteriorPage({
  eyebrow,
  title,
  description,
  children,
}) {
  return (
    <>
      <section className="interior-hero">
        <div className="container">
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </section>
      <section className="container interior-content">
        {children}
      </section>
    </>
  );
}
