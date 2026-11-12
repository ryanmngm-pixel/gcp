
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PublishedHome from "./components/PublishedHome";
import PublishedPage from "./components/PublishedPage";

import About from "./pages/About";
import News from "./pages/News";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Dev from "./pages/Dev";

import "./index.css";
import "./App.css";

const routes = {
  "/": () => <PublishedHome />,
  "/about": () => (
    <PublishedPage pageId="about" component={About} />
  ),
  "/trips": Gallery,
  "/news": () => (
    <PublishedPage pageId="news" component={News} />
  ),
  "/contact": () => (
    <PublishedPage pageId="contact" component={Contact} />
  ),
};

function normalizePath(path) {
  return path.replace(/\/+$/, "") || "/";
}

function resolvePath(path) {
  const normalized = normalizePath(path);
  return normalized === "/gallery" ? "/trips" : normalized;
}

export default function App() {
  const [path, setPath] = useState(() =>
    resolvePath(window.location.pathname)
  );

  useEffect(() => {
    function handleLocationChange() {
      const nextPath = resolvePath(window.location.pathname);

      if (normalizePath(window.location.pathname) !== nextPath) {
        window.history.replaceState(
          {},
          "",
          nextPath + window.location.search + window.location.hash
        );
      }

      setPath(nextPath);
      window.scrollTo(0, 0);
    }

    function handleLinkClick(event) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = event.target.closest("a[href]");

      if (
        !anchor ||
        anchor.target ||
        anchor.hasAttribute("download")
      ) {
        return;
      }

      const url = new URL(anchor.href);

      if (url.origin !== window.location.origin) return;

      event.preventDefault();

      const nextPath = resolvePath(url.pathname);

      if (
        nextPath !== resolvePath(window.location.pathname)
      ) {
        window.history.pushState(
          {},
          "",
          nextPath + url.search + url.hash
        );
      }

      handleLocationChange();
    }

    window.addEventListener("popstate", handleLocationChange);
    document.addEventListener("click", handleLinkClick);

    handleLocationChange();

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      document.removeEventListener("click", handleLinkClick);
    };
  }, []);

  if (path === "/dev") {
    return <Dev />;
  }

  const Page = routes[path];

  return (
    <div className="site-shell">
      <Navbar />

      <main id="main-content">
        {Page ? (
          <Page />
        ) : (
          <section className="not-found container">
            <span className="eyebrow">
              404 — PAGE NOT FOUND
            </span>

            <h1>
              Looks like you've taken a wrong turn.
            </h1>

            <p>
              The page you're looking for doesn't exist.
            </p>

            <a className="button button-dark" href="/">
              Back to home
            </a>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
