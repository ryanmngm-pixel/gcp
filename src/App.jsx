
import Home from "./pages/Home";
import Dev from "./pages/Dev";
import TripApp from "./pages/TripApp";

import { EditorProvider } from "./components/Editable";
import { loadSiteContent } from "./content";

import "./App.css";

export default function App() {
  const path =
    window.location.pathname.replace(/\/+$/, "") || "/";

  if (path === "/dev") {
    return <Dev />;
  }

  if (path === "/trip" || path.startsWith("/trip/")) {
    return <TripApp />;
  }

  return (
    <EditorProvider
      content={loadSiteContent()}
      editing={false}
      update={() => {}}
    >
      <Home />
    </EditorProvider>
  );
}
