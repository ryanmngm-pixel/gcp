
import {
  ArrowDown,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";

import Reveal from "../components/Reveal";
import EditableText from "../components/EditableText";
import EditableImage from "../components/EditableImage";
import heroImage from "../assets/hero.png";

const defaultPhoto = (alt) => [
  {
    url: heroImage,
    alt,
  },
];

export default function Home() {
  return (
    <div className="premium-home">
      {/* OPENING */}
      <section className="premium-opening">
        <div className="opening-content">
          <Reveal>
            <div className="opening-eyebrow">
              <EditableText
                id="home_eyebrow"
                label="Opening eyebrow"
                fallback="GUATEMALA CHILDREN'S PROJECT"
              />
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="opening-title">
              <EditableText
                id="home_title_first"
                label="Opening headline - first line"
                fallback="A little help."
              />
              <br />
              <span>
                <EditableText
                  id="home_title_second"
                  label="Opening headline - second line"
                  fallback="A world of difference."
                />
              </span>
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="opening-description">
              <EditableText
                id="home_description"
                label="Opening description"
                fallback="Because every child deserves a future worth dreaming about."
              />
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div className="opening-actions">
              <a
                className="premium-button"
                href="/contact"
              >
                <EditableText
                  id="home_primary_button"
                  label="Primary button text"
                  fallback="Make a difference"
                />
                <ArrowUpRight size={17} />
              </a>

              <a
                className="premium-text-link"
                href="/about"
              >
                <EditableText
                  id="home_secondary_button"
                  label="Secondary button text"
                  fallback="Discover our story"
                />
                <ArrowRight size={17} />
              </a>
            </div>
          </Reveal>
        </div>

        <div className="opening-scroll-indicator">
          <EditableText
            id="home_scroll_label"
            label="Scroll indicator text"
            fallback="DISCOVER WHAT'S POSSIBLE"
          />
          <ArrowDown size={15} />
        </div>
      </section>

      {/* CINEMATIC IMAGE */}
      <section className="cinematic-section">
        <div className="cinematic-image-container">
          <EditableImage
            id="home_cinematic_photo"
            label="Cinematic homepage photograph"
            fallback={defaultPhoto(
              "Guatemala Children's Project"
            )}
            className="cinematic-image"
            imageClassName="cinematic-image"
          />

          <div className="cinematic-caption">
            <span>
              <EditableText
                id="home_cinematic_caption_left"
                label="Photo caption - left"
                fallback="GUATEMALA"
              />
            </span>

            <span>
              <EditableText
                id="home_cinematic_caption_right"
                label="Photo caption - right"
                fallback="WHERE OUR STORY CONTINUES"
              />
            </span>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="premium-mission">
        <div className="premium-container">
          <Reveal>
            <span className="premium-label">
              <EditableText
                id="home_mission_label"
                label="Mission section label"
                fallback="OUR PURPOSE"
              />
            </span>
          </Reveal>

          <Reveal delay={100}>
            <h2 className="mission-headline">
              <EditableText
                id="home_mission_title_1"
                label="Mission headline - first line"
                fallback="The greatest impact"
              />
              <br />
              <EditableText
                id="home_mission_title_2"
                label="Mission headline - second line"
                fallback="begins with"
              />
              <br />
              <span>
                <EditableText
                  id="home_mission_title_3"
                  label="Mission headline - third line"
                  fallback="human connection."
                />
              </span>
            </h2>
          </Reveal>

          <Reveal delay={150}>
            <p className="mission-description">
              <EditableText
                id="home_mission_description"
                label="Mission description"
                fallback="We believe meaningful change starts when people come together. Through compassion, service, and genuine connection, we're working toward brighter futures for children and communities in Guatemala."
              />
            </p>
          </Reveal>

          <Reveal delay={200}>
            <a
              className="premium-text-link"
              href="/about"
            >
              <EditableText
                id="home_mission_link"
                label="Mission link text"
                fallback="More about our mission"
              />
              <ArrowRight size={18} />
            </a>
          </Reveal>
        </div>
      </section>

      {/* DARK CINEMATIC CHAPTER */}
      <section className="premium-chapter">
        <div className="premium-container">
          <Reveal>
            <span className="premium-label label-light">
              <EditableText
                id="home_chapter_label"
                label="Dark section label"
                fallback="MORE THAN A MISSION"
              />
            </span>
          </Reveal>

          <Reveal delay={100}>
            <h2>
              <EditableText
                id="home_chapter_title_1"
                label="Dark section headline - first line"
                fallback="Real people."
              />
              <br />
              <EditableText
                id="home_chapter_title_2"
                label="Dark section headline - second line"
                fallback="Real moments."
              />
              <br />
              <span>
                <EditableText
                  id="home_chapter_title_3"
                  label="Dark section headline - third line"
                  fallback="Real impact."
                />
              </span>
            </h2>
          </Reveal>

          <Reveal delay={200}>
            <p>
              <EditableText
                id="home_chapter_description"
                label="Dark section description"
                fallback="The moments that matter most aren't always the biggest. Sometimes, they're the simplest."
              />
            </p>
          </Reveal>
        </div>
      </section>

      {/* STORY */}
      <section className="premium-story">
        <div className="premium-container">
          <Reveal>
            <div className="story-heading">
              <span className="premium-label">
                <EditableText
                  id="home_story_label"
                  label="Story section label"
                  fallback="THE EXPERIENCE"
                />
              </span>

              <h2>
                <EditableText
                  id="home_story_title_1"
                  label="Story headline - first line"
                  fallback="You don't just"
                />
                <br />
                <EditableText
                  id="home_story_title_2"
                  label="Story headline - second line"
                  fallback="visit a place."
                />
                <br />
                <span>
                  <EditableText
                    id="home_story_title_3"
                    label="Story headline - third line"
                    fallback="It changes you."
                  />
                </span>
              </h2>
            </div>
          </Reveal>

          <div className="story-grid">
            <Reveal className="story-visual">
              <EditableImage
                id="home_story_photo"
                label="Story section photograph"
                fallback={defaultPhoto(
                  "Community and service in Guatemala"
                )}
              />
            </Reveal>

            <div className="story-copy">
              <Reveal>
                <span className="story-index">
                  <EditableText
                    id="home_story_index"
                    label="Story index"
                    fallback="01 / SERVICE"
                  />
                </span>

                <h3>
                  <EditableText
                    id="home_story_subheading"
                    label="Story subheading"
                    fallback="An experience that stays with you."
                  />
                </h3>

                <p>
                  <EditableText
                    id="home_story_description"
                    label="Story description"
                    fallback="Step outside the everyday. Connect with communities, build relationships, and experience what it means to serve with purpose."
                  />
                </p>

                <a
                  className="premium-text-link"
                  href="/trips"
                >
                  <EditableText
                    id="home_story_link"
                    label="Service trips link"
                    fallback="Explore service trips"
                  />
                  <ArrowRight size={18} />
                </a>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* PHOTO SHOWCASE */}
      <section className="premium-gallery-preview">
        <Reveal>
          <span className="premium-label">
            <EditableText
              id="home_gallery_label"
              label="Gallery section label"
              fallback="THE MOMENTS"
            />
          </span>

          <h2>
            <EditableText
              id="home_gallery_title_1"
              label="Gallery headline - first line"
              fallback="Some stories"
            />
            <br />
            <EditableText
              id="home_gallery_title_2"
              label="Gallery headline - second line"
              fallback="don't need words."
            />
          </h2>

          <p>
            <EditableText
              id="home_gallery_description"
              label="Gallery description"
              fallback="A glimpse into the people and places that make this mission meaningful."
            />
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="gallery-preview-image">
            <EditableImage
              id="home_gallery_photo"
              label="Gallery preview photograph"
              fallback={defaultPhoto(
                "Guatemala Children's Project photo gallery"
              )}
            />
          </div>
        </Reveal>

        <Reveal delay={150}>
          <a
            className="premium-text-link"
            href="/gallery"
          >
            <EditableText
              id="home_gallery_link"
              label="Gallery link text"
              fallback="Explore the gallery"
            />
            <ArrowRight size={18} />
          </a>
        </Reveal>
      </section>

      {/* FINAL CTA */}
      <section className="premium-final">
        <div className="premium-container">
          <Reveal>
            <span className="premium-label">
              <EditableText
                id="home_final_label"
                label="Final section label"
                fallback="THE NEXT CHAPTER STARTS WITH YOU"
              />
            </span>
          </Reveal>

          <Reveal delay={100}>
            <h2>
              <EditableText
                id="home_final_title_1"
                label="Final headline - first line"
                fallback="Be the reason"
              />
              <br />
              <span>
                <EditableText
                  id="home_final_title_2"
                  label="Final headline - second line"
                  fallback="something changes."
                />
              </span>
            </h2>
          </Reveal>

          <Reveal delay={200}>
            <p>
              <EditableText
                id="home_final_description"
                label="Final section description"
                fallback="Every meaningful difference begins with someone willing to make one."
              />
            </p>
          </Reveal>

          <Reveal delay={250}>
            <a
              className="premium-button"
              href="/contact"
            >
              <EditableText
                id="home_final_button"
                label="Final button text"
                fallback="Get involved"
              />
              <ArrowUpRight size={18} />
            </a>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
