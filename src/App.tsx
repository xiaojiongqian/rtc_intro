import { useEffect, useState } from "react";
import { DeckShell } from "./components/DeckShell";
import { slides } from "./data/slides";
import { LabShell } from "./lab/LabShell";

export default function App() {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  if (hash.startsWith("#/lab")) {
    return <LabShell />;
  }

  return <DeckShell slides={slides} />;
}
