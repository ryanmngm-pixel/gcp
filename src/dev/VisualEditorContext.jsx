
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const VisualEditorContext = createContext(null);

function recordsToContent(records) {
  if (!Array.isArray(records)) return {};

  const result = {};

  for (const record of records) {
    if (
      record &&
      typeof record.id === "string" &&
      Object.prototype.hasOwnProperty.call(record, "value")
    ) {
      result[record.id] = record.value;
    }
  }

  return result;
}

export function EditorProvider({ children }) {
  const [content, setContent] = useState({});
  const [selected, setSelected] = useState(null);
  const [dirty, setDirty] = useState(false);

  const update = useCallback((id, value) => {
    setContent((previous) => ({
      ...previous,
      [id]: value,
    }));
    setDirty(true);
  }, []);

  const loadContent = useCallback((records) => {
    setContent(recordsToContent(records));
    setSelected(null);
    setDirty(false);
  }, []);

  const serialize = useCallback(() => {
    return Object.entries(content).map(([id, value]) => ({
      id,
      value,
    }));
  }, [content]);

  const markSaved = useCallback(() => {
    setDirty(false);
  }, []);

  const value = useMemo(
    () => ({
      content,
      selected,
      dirty,
      readOnly: false,
      update,
      select: setSelected,
      loadContent,
      serialize,
      markSaved,
    }),
    [
      content,
      selected,
      dirty,
      update,
      loadContent,
      serialize,
      markSaved,
    ]
  );

  return (
    <VisualEditorContext.Provider value={value}>
      {children}
    </VisualEditorContext.Provider>
  );
}

export function PublishedContentProvider({
  content = {},
  children,
}) {
  const value = useMemo(
    () => ({
      content,
      selected: null,
      dirty: false,
      readOnly: true,
    }),
    [content]
  );

  return (
    <VisualEditorContext.Provider value={value}>
      {children}
    </VisualEditorContext.Provider>
  );
}

export function useVisualEditor() {
  const context = useContext(VisualEditorContext);

  if (!context) {
    throw new Error(
      "Visual editor must be inside EditorProvider."
    );
  }

  return context;
}

export function useOptionalVisualEditor() {
  return useContext(VisualEditorContext);
}
