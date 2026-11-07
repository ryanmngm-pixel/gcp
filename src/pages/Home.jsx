
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  EditableText as Text,
  EditableImage as Photo,
  useSiteContent,
  useEditor,
} from "../components/Editable";

function Marker({ children }) {
  return (
    <div className="section-marker">
      <span className="marker-dot" />
      <span>{children}</span>
    </div>
  );
}

function ArrowLink({ href, children, light = false }) {
  const editor = useEditor();

  return (
    <a
      href={href}
      className={`arrow-link ${light ? "arrow-link-light" : ""}`}
      onClick={(event) => {
        if (editor.editing) event.preventDefault();
      }}
    >
      <span>{children}</span>
      <span className="arrow-link-icon">↗</span>
    </a>
  );
}

function Hero() {
  const { hero } = useSiteContent();
  const editor = useEditor();

  return (
    <section className="hero-section" id="home">
      <Photo
        path={["hero", "image"]}
        alt={hero.imageAlt}
        label="HERO PHOTOGRAPHY"
        className="hero-background"
        priority
      />

      <div className="hero-shade" />

      <div className="hero-editorial">
        <div className="hero-eyebrow">
          <span className="hero-small-line" />
          <Text path={["hero", "eyebrow"]} />
        </div>

        <div className="hero-title-wrap">
          <Text
            path={["hero", "title"]}
            as="h1"
            className="gcp-hero-title"
          />

          <div className="hero-title-side">
            <span className="hero-side-line" />
            <Text path={["hero", "subtitle"]} as="p" />
          </div>
        </div>

        <div className="hero-lower-content">
          <Text path={["hero", "description"]} as="p" />

          <ArrowLink href={hero.primaryHref} light>
            {editor.editing ? (
              <Text path={["hero", "primaryButton"]} />
            ) : (
              hero.primaryButton
            )}
          </ArrowLink>
        </div>
      </div>

      <div className="hero-bottom-bar">
        <Text path={["hero", "location"]} />
        <a href="#discover" className="hero-scroll">
          SCROLL TO EXPLORE <span>↓</span>
        </a>
        <Text path={["hero", "index"]} />
      </div>
    </section>
  );
}

function Intro() {
  const { intro } = useSiteContent();

  return (
    <section className="intro-section" id="discover">
      <div className="intro-top reveal">
        <Marker>
          <Text path={["intro", "eyebrow"]} />
        </Marker>
        <span className="intro-coordinate">GCP / 001</span>
      </div>

      <div className="intro-main reveal">
        <h2>
          <Text path={["intro", "lineOne"]} />
          <Text path={["intro", "lineTwo"]} />
          <Text
            path={["intro", "lineThree"]}
            className="intro-italic"
          />
        </h2>
      </div>

      <div className="intro-bottom reveal">
        <span className="intro-asterisk">✳</span>
        <Text path={["intro", "description"]} as="p" />
      </div>
    </section>
  );
}

function Story() {
  const { story } = useSiteContent();

  return (
    <section className="story-section" id="story">
      <div className="story-image-column reveal">
        <Photo
          path={["story", "image"]}
          alt={story.imageAlt}
          label="STORY PHOTOGRAPHY"
          className="story-image"
        />

        <div className="story-image-caption">
          <span>FIG. 01</span>
          <Text path={["story", "imageCaption"]} />
        </div>
      </div>

      <div className="story-content-column reveal">
        <Marker>
          <Text path={["story", "eyebrow"]} />
        </Marker>

        <Text path={["story", "title"]} as="h2" />

        <div className="story-copy">
          <Text path={["story", "description"]} as="p" />
          <Text path={["story", "secondaryText"]} as="p" />
        </div>

        <div className="story-bottom-mark">
          <span>GCP</span>
          <span>EST. —</span>
        </div>
      </div>
    </section>
  );
}

function Experiences() {
  const { experiences } = useSiteContent();

  return (
    <section className="experiences-section" id="experiences">
      <div className="experiences-heading reveal">
        <div className="experiences-heading-top">
          <Marker>
            <Text path={["experiences", "eyebrow"]} />
          </Marker>
          <span>CURATED FOR THE CURIOUS</span>
        </div>

        <Text path={["experiences", "title"]} as="h2" />

        <div className="experiences-heading-bottom">
          <Text
            path={["experiences", "description"]}
            as="p"
          />
          <span>SCROLL TO DISCOVER ↓</span>
        </div>
      </div>

      <div className="experience-list">
        {experiences.items.map((item, index) => (
          <article
            className={`experience-item experience-item-${index + 1} reveal`}
            key={item.id}
          >
            <div className="experience-photo-wrap">
              <Photo
                path={["experiences", "items", index, "image"]}
                alt={item.imageAlt}
                label={`EXPERIENCE ${item.number}`}
                className="experience-photo"
              />

              <span className="experience-image-index">
                {item.number} / 0{experiences.items.length}
              </span>
            </div>

            <div className="experience-meta">
              <Text
                path={["experiences", "items", index, "category"]}
              />
              <span>{item.number}</span>
            </div>

            <Text
              path={["experiences", "items", index, "title"]}
              as="h3"
            />

            <Text
              path={["experiences", "items", index, "description"]}
              as="p"
            />
          </article>
        ))}
      </div>
    </section>
  );
}

function Statement() {
  const { statement } = useSiteContent();

  return (
    <section className="statement-section">
      <Photo
        path={["statement", "image"]}
        alt={statement.imageAlt}
        label="CINEMATIC PHOTOGRAPHY"
        className="statement-image"
      />

      <div className="statement-shade" />

      <div className="statement-content reveal">
        <Marker>
          <Text path={["statement", "eyebrow"]} />
        </Marker>

        <Text path={["statement", "title"]} as="h2" />

        <span className="statement-symbol">✳</span>
      </div>
    </section>
  );
}

function Journey() {
  const { journey } = useSiteContent();

  return (
    <section className="journey-section" id="journey">
      <div className="journey-heading reveal">
        <Marker>
          <Text path={["journey", "eyebrow"]} />
        </Marker>

        <div className="journey-heading-grid">
          <Text path={["journey", "title"]} as="h2" />
          <Text path={["journey", "description"]} as="p" />
        </div>
      </div>

      <div className="journey-steps">
        {journey.steps.map((step, index) => (
          <div className="journey-step reveal" key={step.number}>
            <span className="journey-number">
              {step.number}
            </span>

            <Text
              path={["journey", "steps", index, "title"]}
              as="h3"
            />

            <Text
              path={["journey", "steps", index, "description"]}
              as="p"
            />

            <span className="journey-step-icon">↗</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Closing() {
  const { closing } = useSiteContent();
  const editor = useEditor();

  return (
    <section className="closing-section">
      <div className="closing-orbit orbit-one" />
      <div className="closing-orbit orbit-two" />

      <div className="closing-content reveal">
        <Marker>
          <Text path={["closing", "eyebrow"]} />
        </Marker>

        <Text path={["closing", "title"]} as="h2" />

        <Text path={["closing", "description"]} as="p" />

        <ArrowLink href={closing.buttonHref} light>
          {editor.editing ? (
            <Text path={["closing", "buttonText"]} />
          ) : (
            closing.buttonText
          )}
        </ArrowLink>
      </div>

      <span className="closing-corner-mark">GCP / END</span>
    </section>
  );
}

export default function Home() {
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");

    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      elements.forEach((el) => el.classList.add("revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Intro />
        <Story />
        <Experiences />
        <Statement />
        <Journey />
        <Closing />
      </main>

      <Footer />
    </>
  );
}
