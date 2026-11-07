
import { useEffect, useState } from "react";
import {
  EditableText as Text,
  useEditor,
  useSiteContent,
} from "./Editable";

export default function Navbar() {
  const content = useSiteContent();
  const editor = useEditor();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function handleNavigation(event) {
    if (editor.editing) {
      event.preventDefault();
      return;
    }

    setMenuOpen(false);
  }

  return (
    <>
      <header
        className={`site-header ${scrolled ? "scrolled" : ""} ${
          menuOpen ? "menu-active" : ""
        }`}
      >
        <a
          href="#home"
          className="site-logo"
          onClick={handleNavigation}
        >
          <Text path={["brand", "name"]} />
          <span className="logo-period">.</span>
        </a>

        <nav
          className="desktop-navigation"
          aria-label="Main navigation"
        >
          {content.navigation.map((item, index) => (
            <a
              href={item.href}
              key={item.href}
              onClick={handleNavigation}
            >
              <Text path={["navigation", index, "label"]} />
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <a
            href="#experiences"
            className="header-cta"
            onClick={handleNavigation}
          >
            Explore <span>↗</span>
          </a>

          <button
            type="button"
            className={`menu-button ${menuOpen ? "is-open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <div
        id="mobile-navigation"
        className={`mobile-navigation ${menuOpen ? "visible" : ""}`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div className="mobile-navigation-inner">
          <span className="mobile-menu-label">NAVIGATION</span>

          {content.navigation.map((item, index) => (
            <a
              href={item.href}
              key={item.href}
              onClick={handleNavigation}
            >
              <span className="mobile-link-index">
                0{index + 1}
              </span>
              <Text path={["navigation", index, "label"]} />
              <span className="mobile-link-arrow">↗</span>
            </a>
          ))}

          <div className="mobile-menu-footer">
            <span>GCP — BEYOND THE ORDINARY</span>
          </div>
        </div>
      </div>
    </>
  );
}
