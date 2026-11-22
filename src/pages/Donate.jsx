import { ArrowUpRight } from "lucide-react";
import InteriorPage from "../components/InteriorPage";
import { donationUrl } from "../publicPages";

export default function Donate() {
  return (
    <InteriorPage
      eyebrow="SUPPORT THE WORK"
      title="Help build what families need."
      description="Your gift helps Guatemala Children’s Project provide building materials for homes, bunk beds, and playgrounds."
      photo={{ id: "donate_hero", url: "/gcp/donate.jpg", alt: "From the GCP project photography archive" }}
    >
      <div className="interior-grid">
        <article className="interior-card">
          <h2>Give online.</h2>
          <p>Use the organization’s PayPal donation page to choose your amount and complete your gift.</p>
          <a className="button button-dark" href={donationUrl} target="_blank" rel="noopener noreferrer">
            Donate with PayPal <ArrowUpRight size={17} />
          </a>
        </article>
        <article className="interior-card">
          <h2>Have a question about giving?</h2>
          <p>Reach out to the team for questions about donations or supporting a project.</p>
          <a className="interior-link" href="/contact">Contact us</a>
        </article>
      </div>
    </InteriorPage>
  );
}
