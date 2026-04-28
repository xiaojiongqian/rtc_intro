import type { Slide } from "../types";
import {
  architectureSlides,
  codecSlides,
  fundamentalsSlides,
  introSlides,
  practiceFrontierSlides,
  protocolSlides,
  securityOpsSlides,
  transportSlides,
} from "./sections";

export const slides: Slide[] = [
  ...introSlides,
  ...fundamentalsSlides,
  ...protocolSlides,
  ...architectureSlides,
  ...codecSlides,
  ...transportSlides,
  ...securityOpsSlides,
  ...practiceFrontierSlides,
];
