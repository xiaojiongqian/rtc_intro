import type { Slide } from "../types";
import { architectureSlides, fundamentalsSlides, introSlides, protocolSlides } from "./sections";

export const slides: Slide[] = [
  ...introSlides,
  ...fundamentalsSlides,
  ...protocolSlides,
  ...architectureSlides,
];
