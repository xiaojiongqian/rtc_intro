import { ChevronLeft, ChevronRight, Moon, PanelRightOpen, Sun } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { InteractionCommand } from "../types";
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
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const saved = window.localStorage.getItem("rtc-slides-theme");
    return saved === "light" ? "light" : "dark";
  });
  const [interactionCommand, setInteractionCommand] = useState<InteractionCommand>({
    tick: 0,
    direction: 1,
  });
  const digitBuffer = useRef("");
  const digitTimer = useRef<number | null>(null);
  const current = slides[index];
  const progress = useMemo(
    () => `${index + 1} / ${slides.length}`,
    [index, slides.length],
  );

  const goTo = useCallback(
    (nextIndex: number) => {
      const bounded = Math.min(Math.max(nextIndex, 0), slides.length - 1);
      setIndex(bounded);
      setInteractionCommand({ tick: 0, direction: 1 });
      window.history.replaceState(null, "", `#/slide/${bounded + 1}`);
    },
    [slides.length],
  );

  const stepInteraction = useCallback((direction: 1 | -1, action?: InteractionCommand["action"]) => {
    setInteractionCommand((command) => ({
      tick: command.tick + 1,
      direction,
      action,
    }));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((value) => (value === "dark" ? "light" : "dark"));
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      setIndex(slideFromHash(slides.length));
      setInteractionCommand({ tick: 0, direction: 1 });
    };
    window.addEventListener("hashchange", onHashChange);
    if (!window.location.hash) {
      window.history.replaceState(null, "", "#/slide/1");
    }
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [slides.length]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("rtc-slides-theme", theme);
  }, [theme]);

  const jumpByDigits = useCallback(
    (digit: string) => {
      if (digitTimer.current) {
        window.clearTimeout(digitTimer.current);
      }
      digitBuffer.current = `${digitBuffer.current}${digit}`.slice(-2);

      const target = Number(digitBuffer.current);
      if (target >= 1 && target <= slides.length) {
        goTo(target - 1);
      }

      digitTimer.current = window.setTimeout(() => {
        digitBuffer.current = "";
      }, 850);
    },
    [goTo, slides.length],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      const isFormField =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (!isFormField && /^\d$/.test(event.key)) {
        event.preventDefault();
        jumpByDigits(event.key);
      }

      if (event.key === "Home") {
        event.preventDefault();
        goTo(0);
      }
      if (event.key === "End") {
        event.preventDefault();
        goTo(slides.length - 1);
      }
      if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
        event.preventDefault();
        goTo(index + 1);
      }
      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        goTo(index - 1);
      }
      if (!isFormField && event.key === "ArrowDown") {
        event.preventDefault();
        stepInteraction(1, "next");
      }
      if (!isFormField && event.key === "Enter") {
        event.preventDefault();
        stepInteraction(1, "activate");
      }
      if (!isFormField && event.key === "ArrowUp") {
        event.preventDefault();
        stepInteraction(-1, "previous");
      }
      if (event.key.toLowerCase() === "n") {
        event.preventDefault();
        setShowNotes((value) => !value);
      }
      if (event.key.toLowerCase() === "t") {
        event.preventDefault();
        toggleTheme();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goTo, index, jumpByDigits, slides.length, stepInteraction, toggleTheme]);

  return (
    <main className="deck-shell">
      <div className="deck-stage" aria-live="polite">
        <SlideFrame
          interactionCommand={interactionCommand}
          slide={current}
          total={slides.length}
        />
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

        <button
          className="icon-button theme-toggle"
          type="button"
          aria-label="Toggle theme"
          onClick={toggleTheme}
        >
          {theme === "dark" ? (
            <Sun size={22} strokeWidth={1.8} />
          ) : (
            <Moon size={22} strokeWidth={1.8} />
          )}
        </button>
      </nav>

      <aside className={`speaker-notes ${showNotes ? "open" : ""}`}>
        <div className="speaker-notes__label">Speaker Notes</div>
        <p>{current.notes}</p>
      </aside>
    </main>
  );
}
