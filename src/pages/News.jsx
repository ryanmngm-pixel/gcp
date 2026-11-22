import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, X } from "lucide-react";
import InteriorPage from "../components/InteriorPage";
import EditableImage from "../components/EditableImage";
import { useOptionalVisualEditor } from "../dev/VisualEditorContext";
import "./News.css";

const tripBackground = "Twice a year, volunteers with the Utah-based Guatemala Children’s Project travel to Guatemala for a week of service. They build bunk beds and playgrounds for children in communities with limited resources.";
const tripWork = "Local families welcomed the group, and children joined in where they could. The crew spent long days working in the heat. When it was time to leave, volunteers remembered the community’s welcome and hoped they could return to serve again.";

const stories = [
  {
    slug: "trip-july2022",
    date: "August 9, 2022",
    category: "Trip report",
    title: "July 2022 trip to Retalhuleu",
    summary: "Twenty-two volunteers traveled to Retalhuleu to build bunk beds and swingsets.",
    body: [
      tripBackground,
      "The July group brought together 22 volunteers, including Maria, a retired teacher, Carlos, an engineering student, and Jerry, a student at Snow Canyon High School who went with about a dozen classmates.",
      tripWork,
    ],
  },
  {
    slug: "feb-2022-trip",
    date: "March 11, 2022",
    category: "Trip report",
    title: "February 2022 trip to Caballo Blanco",
    summary: "The February service trip focused on building bunk beds and swingsets in Caballo Blanco.",
    body: [tripBackground, "In Caballo Blanco, the projects provided beds for families and places for children to play.", tripWork],
  },
  {
    slug: "july-2021-trip",
    date: "August 13, 2021",
    category: "Trip report",
    title: "July 2021 trip to Tegucegalpa",
    summary: "Volunteers gathered in Tegucegalpa to build bunk beds and swingsets.",
    body: [tripBackground, "The report describes a July crew of 22 volunteers, ranging from students to a retired teacher. Their work in Tegucegalpa focused on beds and playground equipment for local children.", tripWork],
  },
  {
    slug: "april-2021-trip",
    date: "May 13, 2021",
    category: "Trip report",
    title: "April 2021 trip to Zacapa",
    summary: "The April service trip brought volunteers to Zacapa to work on bunk beds and swingsets.",
    body: [tripBackground, "In Zacapa, beds and playground equipment were the focus of the service trip. Families welcomed volunteers and children helped with the work.", "The crew spent the week building in the heat. At the end of the trip, volunteers reflected on the relationships they had formed and their hopes of returning."],
  },
  {
    slug: "music-can-change-the-world",
    date: "February 13, 2020",
    category: "Fundraiser",
    author: "Mike Mangum",
    title: "The music fundraiser",
    summary: "GCP sought donations to help Henry replace his keyboard and bring instruments to his group home.",
    body: [
      "GCP first met Henry at an orphanage in Guatemala. He later moved to a boys’ home nearly four hours away, so volunteers saw him less often. They hoped to visit him on their late-February 2020 service trip.",
      "Henry wanted to learn piano and had begun taking lessons at the home. His keyboard broke, and repairs would have cost more than a replacement. He had saved part of the price and asked GCP to help cover the rest.",
      "The fundraiser also aimed to buy a guitar and, if enough was raised, a ukulele for the other boys. GCP wanted to give the young men a creative outlet and help them keep developing their musical skills.",
    ],
  },
  {
    slug: "sanchez-family-home",
    date: "June 13, 2019",
    category: "Fundraiser",
    author: "Mike Mangum",
    title: "Sanchez family home fundraiser",
    summary: "GCP launched a $5,000 fundraiser to build a safer home for the Sanchez family.",
    body: [
      "An electrical accident led to the amputation of the father’s leg and left him unable to work. His wife supported their family of six by gathering and selling firewood. Meanwhile, cracks in the walls of their home grew serious enough that the building was at risk of collapse.",
      "GCP planned to send a crew in July 2019 and asked donors to help meet a $5,000 goal for the new home. The appeal emphasized that contributions of any size could move the project forward.",
    ],
  },
];

function StoryDialog({ story, onClose }) {
  const dialog = useRef(null);

  useEffect(() => {
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";

    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return createPortal(
    <dialog
      ref={dialog}
      className="gcp-story-dialog"
      aria-labelledby="gcp-story-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="gcp-story-panel">
        <div className="gcp-story-toolbar">
          <span>GCP News</span>
          <button type="button" aria-label="Close article" onClick={onClose} autoFocus>
            <X size={21} aria-hidden="true" />
          </button>
        </div>
        <article className="gcp-story-content">
          <p className="eyebrow">{story.category} · {story.date}</p>
          <h2 id="gcp-story-title">{story.title}</h2>
          {story.author && <p className="gcp-story-byline">By {story.author}</p>}
          <EditableImage
            id={"news_" + story.slug}
            label={story.title + " photograph"}
            fallback={[{ url: story.image, alt: story.title }]}
            className="gcp-story-photo"
            parallax={false}
          />
          {story.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </article>
      </div>
    </dialog>,
    document.body
  );
}

export default function News() {
  const [openStory, setOpenStory] = useState(null);
  const editor = useOptionalVisualEditor();
  const editing = Boolean(editor && !editor.readOnly);
  const opener = useRef(null);

  function closeStory() {
    setOpenStory(null);
    requestAnimationFrame(() => opener.current?.focus());
  }

  return (
    <InteriorPage
      eyebrow="FIELD NOTES"
      title="Dispatches from Guatemala."
      description="Trip reports, fundraisers, and stories from the Guatemala Children’s Project archive."
      photo={{ id: "news_hero", url: "/gcp/gallery.jpg", alt: "Photograph from the GCP field archive" }}
    >
      <div className="interior-grid interior-grid-three">
        {stories.map((story, index) => {
          const image = "/gcp/news-" + (index + 1) + ".jpg";

          function openArticle(event) {
            event.stopPropagation();
            opener.current = event.currentTarget.closest("article")?.querySelector(".gcp-story-trigger");
            setOpenStory({ ...story, image });
          }

          return (
            <article
              className={`interior-card gcp-news-card${editing ? "" : " gcp-news-openable"}`}
              key={story.slug}
              id={story.slug}
              onClick={editing ? undefined : openArticle}
            >
              <EditableImage id={"news_" + story.slug} label={story.title + " photograph"} fallback={[{ url: image, alt: story.title }]} className="gcp-news-image" parallax={false} />
              <span className="eyebrow">{story.category} · {story.date}</span>
              <h2>{story.title}</h2>
              <p>{story.summary}</p>
              {!editing && (
                <button className="interior-link gcp-story-trigger" type="button" aria-haspopup="dialog" aria-label={"Read " + story.title} onClick={openArticle}>
                  Read article <ArrowRight size={17} aria-hidden="true" />
                </button>
              )}
            </article>
          );
        })}
      </div>
      {openStory && <StoryDialog story={openStory} onClose={closeStory} />}
    </InteriorPage>
  );
}
