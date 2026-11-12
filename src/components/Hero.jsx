
import { ArrowUpRight } from "lucide-react";

export default function Hero({
  eyebrow,
  title,
  description,
  image,
  primaryLabel = "Get involved",
  primaryHref = "/contact",
  secondaryLabel = "Our story",
  secondaryHref = "/about",
}) {
  return (
    <section className="hero">
      <div className="hero-image-wrap">
        <img
          className="hero-image"
          src={image}
          alt="Guatemala Children's Project community"
        />
        <div className="hero-overlay" />
      </div>

      <div className="hero-content container">
        <span className="hero-eyebrow">
          <span className="eyebrow-dot" />
          {eyebrow}
        </span>

        <h1>{title}</h1>
        <p>{description}</p>

        <div className="hero-actions">
          <a className="button button-white" href={primaryHref}>
            {primaryLabel}
            <ArrowUpRight size={18} />
          </a>

          <a className="button button-outline" href={secondaryHref}>
            {secondaryLabel}
          </a>
        </div>
      </div>

      <div className="hero-bottom">
        <span>GUATEMALA CHILDREN'S PROJECT</span>
        <span>SCROLL TO EXPLORE ↓</span>
      </div>
    </section>
  );
}
