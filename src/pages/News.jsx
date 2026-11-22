import InteriorPage from "../components/InteriorPage";
import EditableImage from "../components/EditableImage";

const stories = [
  ["trip-july2022", "August 9, 2022", "Trip report", "July 2022 trip to Retalhuleu", "Twenty-two volunteers traveled to Retalhuleu to build bunk beds and swingsets. Community members joined the work."],
  ["feb-2022-trip", "March 11, 2022", "Trip report", "February 2022 trip to Caballo Blanco", "The February team built bunk beds and swingsets in Caballo Blanco, giving families places to sleep and children places to play."],
  ["july-2021-trip", "August 13, 2021", "Trip report", "July 2021 trip to Tegucegalpa", "The July volunteers worked on bunk beds and swingsets in Tegucegalpa."],
  ["april-2021-trip", "May 13, 2021", "Trip report", "April 2021 trip to Zacapa", "The April service trip brought volunteers to Zacapa to work on bunk beds and swingsets."],
  ["music-can-change-the-world", "February 13, 2020", "Fundraiser", "The music fundraiser", "This fundraiser introduced Henry, a young man the organization first met at the orphanage years earlier."],
  ["sanchez-family-home", "June 13, 2019", "Fundraiser", "Sanchez family home fundraiser", "GCP set a goal of raising $5,000 to replace the Sanchez family’s unsafe home and planned to send a volunteer crew to build it."],
];

export default function News() {
  return (
    <InteriorPage
      eyebrow="FIELD NOTES"
      title="Dispatches from Guatemala."
      description="Trip reports, fundraisers, and stories from the Guatemala Children’s Project archive."
      photo={{ id: "news_hero", url: "/gcp/gallery.jpg", alt: "Photograph from the GCP field archive" }}
    >
      <div className="interior-grid interior-grid-three">
        {stories.map(([slug, date, category, title, detail], index) => (
          <article className="interior-card gcp-news-card" key={slug} id={slug}>
            <EditableImage id={"news_" + slug} label={title + " photograph"} fallback={[{ url: "/gcp/news-" + (index + 1) + ".jpg", alt: title }]} className="gcp-news-image" parallax={false} />
            <span className="eyebrow">{category} · {date}</span>
            <h2>{title}</h2>
            <p>{detail}</p>
            {!/^(www\.)?guatemalachildrensproject\.org$/.test(window.location.hostname) && (
              <a className="interior-link" href={"https://guatemalachildrensproject.org/" + slug + "/"} target="_blank" rel="noopener noreferrer">Read the original story</a>
            )}
          </article>
        ))}
      </div>
    </InteriorPage>
  );
}
