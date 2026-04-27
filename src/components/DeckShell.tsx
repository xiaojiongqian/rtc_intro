import { ChevronLeft, ChevronRight, PanelRightOpen } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Slide } from "../types";
import { SlideFrame } from "./SlideFrame";

type DeckShellProps = {
  slides: Slide[];
};

const slideFromHash = (max: number) => {
  const match = window.location.hash.match(/^#\/slide\/(\d+)$/);
  if (!match) return 0;
  const value = Number(match[1]);
  if (!Number.isFinite(value)) return 0;
  return Math.min(Math.max(value - 1, 0), max - 1);
};

export function DeckShell({ slides }: DeckShellProps) {
  const [index, setIndex] = useState(() => slideFromHash(slides.length));
  const [showNotes, setShowNotes] = useState(false);
  const current = slides[index];
  const progress = useMemo(
    () => `${index + 1} / ${slides.length}`,
    [index, slides.length],
  );

  const goTo = useCallback(
    (nextIndex: number) => {
      const bounded = Math.min(Math.max(nextIndex, 0), slides.length - 1);
      setIndex(bounded);
      window.history.replaceState(null, "", `#/slide/${bounded + 1}`);
    },
    [slides.length],
  );

  useEffect(() => {
    const onHashChange = () => setIndex(slideFromHash(slides.length));
    window.addEventListener("hashchange", onHashChange);
    if (!window.location.hash) {
      window.history.replaceState(null, "", "#/slide/1");
    }
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [slides.length]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
        event.preventDefault();
        goTo(index + 1);
      }
      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        goTo(index - 1);
      }
      if (event.key.toLowerCase() === "n") {
        setShowNotes((value) => !value);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goTo, index]);

  return (
    <main className="deck-shell">
      <div className="deck-stage" aria-live="polite">
        <SlideFrame slide={current} total={slides.length} />
      </div>

      <nav className="deck-controls" aria-label="Slides">
        <button
          className="icon-button"
          type="button"
          aria-label="Previous slide"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
        >
          <ChevronLeft size={24} strokeWidth={1.8} />
        </button>

        <div className="slide-dots" aria-label={progress}>
          {slides.map((slide, dotIndex) => (
            <button
              className={`slide-dot ${dotIndex === index ? "active" : ""}`}
              key={slide.id}
              type="button"
              aria-label={`Slide ${slide.id}`}
              onClick={() => goTo(dotIndex)}
            />
          ))}
        </div>

        <button
          className="icon-button"
          type="button"
          aria-label="Next slide"
          onClick={() => goTo(index + 1)}
          disabled={index === slides.length - 1}
        >
          <ChevronRight size={24} strokeWidth={1.8} />
        </button>

        <button
          className={`icon-button notes-toggle ${showNotes ? "active" : ""}`}
          type="button"
          aria-label="Speaker notes"
          onClick={() => setShowNotes((value) => !value)}
        >
          <PanelRightOpen size={22} strokeWidth={1.8} />
        </button>
      </nav>

      <aside className={`speaker-notes ${showNotes ? "open" : ""}`}>
        <div className="speaker-notes__label">Speaker Notes</div>
        <p>{current.notes}</p>
      </aside>
    </main>
  );
}
