
import { ArrowUpRight } from "lucide-react";

import { publicPages } from "../publicPages";

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
            {publicPages.filter(({ href }) => !["/volunteer", "/donate"].includes(href)).map((link) => (
              <a href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </div>

          <div className="footer-navigation">
            <span>GET INVOLVED</span>
            <a href="/volunteer">
              Volunteer
              <ArrowUpRight size={15} />
            </a>
            <a href="/donate">Donate <ArrowUpRight size={15} /></a>
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
