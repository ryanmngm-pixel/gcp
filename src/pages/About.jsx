import { ArrowRight } from "lucide-react";
import InteriorPage from "../components/InteriorPage";
import EditableImage from "../components/EditableImage";

const board = [
  ["Ken Mangum", "President", "ken-mangum"],
  ["Gordon Wade", "Vice President", "gordon-wade"],
  ["Mike Mangum", "Vice President", "mike-mangum"],
  ["Hugo Zamora Galves", "Board Member", "hugo-zamora"],
  ["Marci Thompson", "Board Member", "marci-thompson"],
];

export default function About() {
  return (
    <InteriorPage
      eyebrow="OUR STORY"
      title="Building a future one child at a time."
      description="Guatemala Children’s Project is a Utah-based nonprofit serving children and families in rural Guatemala."
      photo={{ id: "about_hero", url: "/gcp/story.jpg", alt: "Community life in Guatemala from the GCP archive" }}
    >
      <div className="interior-grid">
        <article className="interior-card">
          <h2>What we build</h2>
          <p>GCP volunteers join local communities to build homes, bunk beds, and playgrounds. The organization brings groups to Guatemala for hands-on service trips throughout the year.</p>
          <a className="interior-link" href="/galleries">Explore the galleries <ArrowRight size={17} /></a>
        </article>
        <article className="interior-card gcp-field-note">
          <h2>A new home for the Sanchez family</h2>
          <p>After an injury left the family’s father unable to work, their home began to deteriorate. Donations from the St. George community and the work of GCP volunteers helped build them a new one.</p>
          <a className="interior-link" href="/news#sanchez-family-home">Read the project update <ArrowRight size={17} /></a>
        </article>
      </div>

      <section className="gcp-board">
        <span className="eyebrow">LEADERSHIP</span>
        <h2>Meet the board.</h2>
        <div className="gcp-board-grid">
          {board.map(([name, role, slug]) => (
            <article key={slug}>
              <EditableImage id={"board_" + slug} label={name + " portrait"} fallback={[{ url: "/gcp/" + slug + ".jpg", alt: name }]} className="gcp-board-photo" parallax={false} />
              <h3>{name}</h3>
              <p>{role}</p>
            </article>
          ))}
        </div>
      </section>
    </InteriorPage>
  );
}
