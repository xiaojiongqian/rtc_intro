import type { Slide } from "../types";
import { architectureSlides, codecSlides, fundamentalsSlides, introSlides, protocolSlides } from "./sections";

export const slides: Slide[] = [
  ...introSlides,
  ...fundamentalsSlides,
  ...protocolSlides,
  ...architectureSlides,
  ...codecSlides,
];
