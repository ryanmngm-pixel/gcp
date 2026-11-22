
import { useEffect, useState } from "react";
import { getPublished } from "../dev/contentApi";
import { PublishedContentProvider } from "../dev/VisualEditorContext";
import PageTextLayer from "./PageTextLayer";

export default function PublishedPage({
  pageId,
  contentKey = `${pageId}_visual`,
  component: Page,
}) {
  const [content, setContent] = useState({});

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const records = await getPublished(contentKey);

        if (!mounted) return;

        const result = {};

        if (Array.isArray(records)) {
          records.forEach((record) => {
            if (
              record &&
              typeof record.id === "string" &&
              Object.prototype.hasOwnProperty.call(
                record,
                "value"
              )
            ) {
              result[record.id] = record.value;
            }
          });
        }

        setContent(result);
      } catch (error) {
        console.error(
          `Unable to load ${pageId} content:`,
          error
        );
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [contentKey, pageId]);

  return (
    <PublishedContentProvider content={content}>
      <PageTextLayer pageId={pageId}>
        <Page />
      </PageTextLayer>
    </PublishedContentProvider>
  );
}
