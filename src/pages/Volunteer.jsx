import { ArrowRight } from "lucide-react";
import InteriorPage from "../components/InteriorPage";
import InquiryForm from "../components/InquiryForm";
import { facebook } from "../publicPages";

export default function Volunteer() {
  return (
    <InteriorPage
      eyebrow="VOLUNTEER IN GUATEMALA"
      title="Come build with us."
      description="Join a service trip and help build homes, bunk beds, and playgrounds alongside local communities."
      photo={{ id: "volunteer_hero", url: "/gcp/volunteer.jpg", alt: "Photograph from a GCP volunteer service trip" }}
    >
      <div className="gcp-contact-layout">
        <article className="interior-card">
          <h2>Ask about volunteering</h2>
          <InquiryForm kind="volunteer" />
        </article>
        <aside className="interior-card gcp-field-note">
          <span className="eyebrow">UPCOMING SERVICE TRIPS</span>
          <h2>February 13–22, 2027</h2>
          <p>GCP lists another trip for summer 2027, with dates to be announced. Ask the team about availability and trip requirements.</p>
          <a className="interior-link" href="/galleries">See past service trips <ArrowRight size={17} /></a>
          <a className="interior-link" href={facebook} target="_blank" rel="noopener noreferrer">Reach GCP on Facebook</a>
        </aside>
      </div>
    </InteriorPage>
  );
}
