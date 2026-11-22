import { ArrowUpRight } from "lucide-react";
import InteriorPage from "../components/InteriorPage";
import InquiryForm from "../components/InquiryForm";
import { facebook, officialSite } from "../publicPages";

export default function Contact() {
  const onOfficialHost = /^(www\.)?guatemalachildrensproject\.org$/.test(window.location.hostname);

  return (
    <InteriorPage
      eyebrow="GET IN TOUCH"
      title="Let’s connect."
      description="Send a question about service trips, donations, partnerships, or anything you’d like to share with the board."
      photo={{ id: "contact_hero", url: "/gcp/contact.jpg", alt: "From the Guatemala Children’s Project service trip archive" }}
    >
      <div className="gcp-contact-layout">
        <article className="interior-card">
          <h2>Send a message</h2>
          <InquiryForm />
        </article>
        <aside className="interior-card gcp-field-note">
          <h2>Find us</h2>
          <address>Guatemala Children’s Project<br />170 N 400 East, Suite H<br />St. George, UT 84770</address>
          <a className="interior-link" href={facebook} target="_blank" rel="noopener noreferrer">Facebook <ArrowUpRight size={16} /></a>
          <a className="interior-link" href="https://www.youtube.com/@guate1" target="_blank" rel="noopener noreferrer">YouTube <ArrowUpRight size={16} /></a>
          <a className="interior-link" href="https://www.instagram.com/guatemalachildrensproject/" target="_blank" rel="noopener noreferrer">Instagram <ArrowUpRight size={16} /></a>
          {!onOfficialHost && (
            <a className="interior-link" href={officialSite + "/contact/"} target="_blank" rel="noopener noreferrer">
              Original contact form <ArrowUpRight size={16} />
            </a>
          )}
        </aside>
      </div>
    </InteriorPage>
  );
}
