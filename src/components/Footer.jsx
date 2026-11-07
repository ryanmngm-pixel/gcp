
import {
  EditableText as Text,
  useEditor,
  useSiteContent,
} from "./Editable";

export default function Footer() {
  const content = useSiteContent();
  const editor = useEditor();

  function preventEditingNavigation(event) {
    if (editor.editing) event.preventDefault();
  }

  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div>
          <span className="footer-label">GCP / EXPLORE MORE</span>
          <Text path={["footer", "tagline"]} as="p" />
        </div>

        <nav aria-label="Footer navigation">
          {content.navigation.map((item, index) => (
            <a
              href={item.href}
              key={item.href}
              onClick={preventEditingNavigation}
            >
              <Text path={["navigation", index, "label"]} />
            </a>
          ))}
        </nav>
      </div>

      <a
        href="#home"
        className="footer-giant-logo"
        onClick={preventEditingNavigation}
      >
        <Text path={["brand", "name"]} />
        <span>.</span>
      </a>

      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()}{" "}
          <Text path={["footer", "copyright"]} />.
          All rights reserved.
        </span>

        <Text path={["footer", "note"]} />

        <a href="#home" onClick={preventEditingNavigation}>
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
