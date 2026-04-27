import { DeckShell } from "./components/DeckShell";
import { slides } from "./data/slides";

export default function App() {
  return <DeckShell slides={slides} />;
}
