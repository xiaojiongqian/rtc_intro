import type { Slide } from "../types";
import { VisualRenderer } from "./VisualRenderer";

type SlideFrameProps = {
  slide: Slide;
  total: number;
};

export function SlideFrame({ slide, total }: SlideFrameProps) {
  return (
    <article className="slide-frame">
      <header className="slide-header">
        <div>
          <p className="slide-section">{slide.section}</p>
          <h1>{slide.title}</h1>
          {slide.subtitle ? <p className="slide-subtitle">{slide.subtitle}</p> : null}
        </div>
        <div className="slide-meta">
          <span>{String(slide.id).padStart(2, "0")}</span>
          <span>{slide.durationMinutes} min</span>
        </div>
      </header>

      <div className="slide-content">
        <section className="key-points" aria-label="Key points">
          {slide.keyPoints.map((point, pointIndex) => (
            <p key={point}>
              <span>{String(pointIndex + 1).padStart(2, "0")}</span>
              {point}
            </p>
          ))}
        </section>
        <section className="visual-panel">
          <VisualRenderer visual={slide.visual} />
        </section>
      </div>

      <footer className="slide-footer">
        <span>RTC Core Theory</span>
        <span>
          {slide.id} / {total}
        </span>
      </footer>
    </article>
  );
}
