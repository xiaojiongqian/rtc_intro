export type VisualType =
  | "learningMap"
  | "courseRhythm"
  | "rtcScope"
  | "signalChain"
  | "latencyBudget"
  | "jitterSync"
  | "qosQoeMatrix";

export type VisualSpec<TData = unknown> = {
  type: VisualType;
  data: TData;
  variant?: string;
};

export type Slide = {
  id: number;
  section: string;
  title: string;
  subtitle?: string;
  durationMinutes: number;
  keyPoints: string[];
  visual: VisualSpec;
  notes?: string;
};

export type LearningMapData = {
  anchors: Array<{
    label: string;
    detail: string;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
};

export type CourseRhythmData = {
  phases: Array<{
    label: string;
    minutes: number;
    focus: string;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
};

export type RtcScopeData = {
  modes: Array<{
    label: string;
    latency: string;
    flow: string;
    fit: string;
    active?: boolean;
  }>;
};

export type SignalChainData = {
  nodes: Array<{
    label: string;
    detail: string;
    latency: string;
    risk: string;
  }>;
};

export type LatencyBudgetData = {
  segments: Array<{
    label: string;
    min: number;
    base: number;
    max: number;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
};

export type JitterSyncData = {
  arrivals: number[];
  playout: number[];
  syncPairs: Array<{
    audio: number;
    video: number;
  }>;
};

export type QosQoeMatrixData = {
  rows: Array<{
    metric: string;
    qos: string;
    qoe: string;
    tradeoff: string;
  }>;
};
