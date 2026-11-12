
import { ArrowUpRight } from "lucide-react";

const footerLinks = [
  { label: "Our Story", href: "/about" },
  { label: "Trips", href: "/trips" },
  { label: "News", href: "/news" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="premium-footer">
      <div className="premium-container">
        <div className="footer-top">
          <div>
            <a href="/" className="footer-brand">
              GCP<span>.</span>
            </a>
            <p>
              A little help.
              <br />
              A world of difference.
            </p>
          </div>

          <div className="footer-navigation">
            <span>EXPLORE</span>
            {footerLinks.map((link) => (
              <a href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </div>

          <div className="footer-navigation">
            <span>GET INVOLVED</span>
            <a href="/contact">
              Make a difference
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Guatemala Children's Project.
            All rights reserved.
          </span>
          <span>Made with purpose.</span>
        </div>
      </div>
    </footer>
  );
}
