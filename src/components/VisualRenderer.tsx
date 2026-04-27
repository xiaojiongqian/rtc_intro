import type {
  CourseRhythmData,
  JitterSyncData,
  LatencyBudgetData,
  LearningMapData,
  QosQoeMatrixData,
  RtcScopeData,
  SignalChainData,
  VisualSpec,
} from "../types";
import {
  CourseRhythm,
  JitterSync,
  LatencyBudget,
  LearningMap,
  QosQoeMatrix,
  RtcScope,
  SignalChain,
} from "./visuals";

type VisualRendererProps = {
  visual: VisualSpec;
};

export function VisualRenderer({ visual }: VisualRendererProps) {
  switch (visual.type) {
    case "learningMap":
      return <LearningMap data={visual.data as LearningMapData} />;
    case "courseRhythm":
      return <CourseRhythm data={visual.data as CourseRhythmData} />;
    case "rtcScope":
      return <RtcScope data={visual.data as RtcScopeData} />;
    case "signalChain":
      return <SignalChain data={visual.data as SignalChainData} />;
    case "latencyBudget":
      return <LatencyBudget data={visual.data as LatencyBudgetData} />;
    case "jitterSync":
      return <JitterSync data={visual.data as JitterSyncData} />;
    case "qosQoeMatrix":
      return <QosQoeMatrix data={visual.data as QosQoeMatrixData} />;
    default:
      return null;
  }
}
