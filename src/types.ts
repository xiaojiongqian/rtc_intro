export type VisualType =
  | "learningMap"
  | "courseRhythm"
  | "rtcScope"
  | "scenarioMap"
  | "studentPrompt"
  | "protocolStack"
  | "protocolFlow"
  | "offerAnswer"
  | "signalingBoundary"
  | "icePath"
  | "connectionTroubleshooting"
  | "secureChannel"
  | "meshArchitecture"
  | "sfuArchitecture"
  | "mediaTopologyComparison"
  | "hybridArchitecture"
  | "architectureDecision"
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
  takeaway?: string;
  visual: VisualSpec;
  notes?: string;
};

export type InteractionCommand = {
  tick: number;
  direction: 1 | -1;
  action?: "next" | "previous" | "activate";
};

export type LearningMapData = {
  anchors: Array<{
    label: string;
    detail: string;
    depth: string;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
};

export type CourseRhythmData = {
  phases: Array<{
    label: string;
    minutes: number;
    focus: string;
    output: string;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
};

export type RtcScopeData = {
  modes: Array<{
    label: string;
    latency: string;
    flow: string;
    fit: string;
    constraint: string;
    active?: boolean;
  }>;
};

export type ScenarioMapData = {
  scenarios: Array<{
    label: string;
    setting: string;
    media: string;
    constraint: string;
    metric: string;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
};

export type StudentPromptData = {
  question: string;
  instruction: string;
  options: Array<{
    label: string;
    answer: string;
    rationale: string;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
};

export type ProtocolStackData = {
  layers: Array<{
    label: string;
    role: string;
    plane: string;
    evidence: string;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
};

export type ProtocolFlowData = {
  lanes: Array<{
    label: string;
    direction: string;
    payload: string;
    signal: string;
    evidence: string;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
};

export type OfferAnswerData = {
  steps: Array<{
    actor: string;
    action: string;
    detail: string;
    state: string;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
};

export type SignalingBoundaryData = {
  zones: Array<{
    label: string;
    owner: string;
    examples: string;
    boundary: string;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
};

export type IcePathData = {
  paths: Array<{
    label: string;
    diagram: "host" | "stun" | "turn";
    route: string;
    cost: string;
    risk: string;
    mediaFlow: string;
    probeFlow: string;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
  checks: string[];
};

export type ConnectionTroubleshootingData = {
  incident: string;
  stages: Array<{
    label: string;
    question: string;
    evidence: string[];
    nextAction: string;
    tone: "signal" | "protocol" | "warning" | "accent";
    examples: Array<{
      symptom: string;
      clue: string;
      likelyCause: string;
      action: string;
    }>;
  }>;
};

export type SecureChannelData = {
  stages: Array<{
    label: string;
    detail: string;
    output: string;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
  sequence: Array<{
    from: "signaling" | "peerA" | "peerB" | "media";
    to: "signaling" | "peerA" | "peerB" | "media";
    label: string;
    detail: string;
    stage: number;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
};

export type MeshArchitectureData = {
  roomSizes: Array<{
    participants: number;
    fit: string;
    encoding: string;
    pain: string;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
};

export type SfuArchitectureData = {
  uplink: {
    label: string;
    detail: string;
  };
  layers: Array<{
    label: string;
    bitrate: string;
    fit: string;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
  receivers: Array<{
    label: string;
    network: string;
    subscription: string;
    reason: string;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
};

export type MediaTopologyComparisonData = {
  modes: Array<{
    label: string;
    server: string;
    headline: string;
    inputLabel: string;
    serverSteps: string[];
    outputs: Array<{
      label: string;
      stream: string;
    }>;
    summary: string;
    tradeoff: string;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
};

export type HybridArchitectureData = {
  modes: Array<{
    label: string;
    useCase: string;
    processing: {
      label: string;
      mode: "forward" | "reencode" | "mixed";
      detail: string;
    };
    path: string[];
    strengths: string[];
    costs: string[];
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
};

export type ArchitectureDecisionData = {
  scenario: string;
  criteria: Array<{
    label: string;
    question: string;
    facilitatorPrompt: string;
  }>;
  options: Array<{
    label: string;
    fit: string;
    rationale: string;
    risks: string;
    strengths: string[];
    weaknesses: string[];
    bestFor: string;
    avoidWhen: string;
    lensNotes: string[];
    scores: number[];
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
};

export type SignalChainData = {
  nodes: Array<{
    label: string;
    detail: string;
    latency: string;
    risk: string;
    metric: string;
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
    qosMetric: string;
    qoeMetric: string;
    qos: string;
    qoe: string;
    tradeoff: string;
    qosSignal: string;
    qoeSignal: string;
  }>;
};
