
import { useEffect, useState } from "react";
import Home from "../pages/Home";
import { getPublished } from "../dev/contentApi";
import { PublishedContentProvider } from "../dev/VisualEditorContext";

export default function PublishedHome() {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const records = await getPublished("home_visual");

        if (!mounted) return;

        const next = {};

        if (Array.isArray(records)) {
          for (const record of records) {
            if (
              record &&
              typeof record.id === "string" &&
              Object.prototype.hasOwnProperty.call(
                record,
                "value"
              )
            ) {
              next[record.id] = record.value;
            }
          }
        }

        setContent(next);
      } catch (error) {
        console.error(
          "Unable to load published homepage:",
          error
        );
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return null;
  }

  return (
    <PublishedContentProvider content={content}>
      <Home />
    </PublishedContentProvider>
  );
}
