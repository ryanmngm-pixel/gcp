
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Menu,
  X,
} from "lucide-react";

import { publicPages } from "../publicPages";

export default function Navbar({ path }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 15);
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function closeMenu() {
    setMobileOpen(false);
  }

  return (
    <>
      <header
        className={`apple-nav ${
          scrolled ? "is-scrolled" : ""
        }`}
      >
        <div className="apple-nav-inner">
          <a
            href="/"
            className="apple-logo"
            onClick={closeMenu}
            aria-label="Guatemala Children's Project home"
          >
            GCP<span>.</span>
          </a>

          <nav
            className="apple-nav-links"
            aria-label="Main navigation"
          >
            {publicPages.filter(({ href }) => href !== "/donate").map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={path === link.href ? "page" : undefined}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href="/donate"
            aria-current={path === "/donate" ? "page" : undefined}
            className="apple-nav-action"
          >
            Donate
            <ArrowUpRight size={15} />
          </a>

          <button
            type="button"
            className="apple-menu-button"
            onClick={() =>
              setMobileOpen((previous) => !previous)
            }
            aria-label={
              mobileOpen ? "Close menu" : "Open menu"
            }
            aria-expanded={mobileOpen}
            aria-controls="gcp-mobile-navigation"
          >
            {mobileOpen ? (
              <X size={23} />
            ) : (
              <Menu size={23} />
            )}
          </button>
        </div>
      </header>

      <div
        id="gcp-mobile-navigation"
        className={`apple-mobile-menu ${
          mobileOpen ? "is-open" : ""
        }`}
        aria-hidden={!mobileOpen}
      >
        <nav aria-label="Mobile navigation">
          {publicPages.map((link) => (
            <a
              key={link.href}
              href={link.href}
                aria-current={path === link.href ? "page" : undefined}
              onClick={closeMenu}
              tabIndex={mobileOpen ? 0 : -1}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="mobile-menu-bottom">
          Guatemala Children's Project
        </div>
      </div>
    </>
  );
}
