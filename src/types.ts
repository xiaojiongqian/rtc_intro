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
  | "codecOverview"
  | "audioProcessing"
  | "videoParameters"
  | "layeredEncoding"
  | "codecTradeoff"
  | "bandwidthControl"
  | "lossRecovery"
  | "recoveryMechanism"
  | "jitterBufferTuning"
  | "audioPreprocessingStrategy"
  | "recoveryStrategySort"
  | "latencyOptimizationChecklist"
  | "securityPrivacyBoundary"
  | "deploymentTopology"
  | "testingToolchain"
  | "monitoringDashboard"
  | "sloLadder"
  | "incidentTimeline"
  | "practiceRunbook"
  | "signalingServerWalkthrough"
  | "browserP2PWalkthrough"
  | "sfuCodeWalkthrough"
  | "experimentReview"
  | "ecosystemMap"
  | "standardsTimeline"
  | "referenceFigure"
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

export type CodecOverviewData = {
  logicSteps: Array<{
    label: string;
    question: string;
    detail: string;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
  scenarios: Array<{
    label: string;
    context: string;
    recommended: string;
    reason: string;
    priorities: string[];
    preferredCodecs: string[];
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
  codecs: Array<{
    label: string;
    kind: "audio" | "video";
    tier: "baseline" | "enhancement";
    role: string;
    strength: string;
    cost: string;
    fit: string;
    baseline: string;
    decision: string;
    metrics: Array<{
      label: string;
      value: string;
      note: string;
    }>;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
};

export type AudioProcessingData = {
  scenarios: Array<{
    label: string;
    prompt: string;
    codec: string;
    capture: string;
    answer: string;
    stages: Array<{
      label: string;
      setting: "on" | "off" | "careful";
      detail: string;
      tone: "signal" | "protocol" | "warning" | "accent";
    }>;
  }>;
};

export type VideoParametersData = {
  cases: Array<{
    label: string;
    symptom: string;
    diagnosis: string;
    recommendation: string;
    metrics: Array<{
      label: string;
      value: string;
      tone: "signal" | "protocol" | "warning" | "accent";
    }>;
    levers: Array<{
      label: string;
      choice: string;
      impact: string;
      tone: "signal" | "protocol" | "warning" | "accent";
    }>;
  }>;
};

export type LayeredEncodingData = {
  modes: Array<{
    label: string;
    summary: string;
    serverBehavior: string;
    tradeoff: string;
    layers: Array<{
      label: string;
      resolution: string;
      bitrate: string;
      dependency: string;
      tone: "signal" | "protocol" | "warning" | "accent";
    }>;
  }>;
  receivers: Array<{
    label: string;
    layout: string;
    network: string;
    subscription: string;
    why: string;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
};

export type CodecTradeoffData = {
  scenario: string;
  criteria: Array<{
    label: string;
    question: string;
  }>;
  options: Array<{
    label: string;
    verdict: string;
    shortTerm: string;
    longTerm: string;
    risk: string;
    scores: number[];
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
};

export type BandwidthControlData = {
  loop: Array<{
    label: string;
    role: string;
    evidence: string;
    output: string;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
  scenarios: Array<{
    label: string;
    signal: string;
    estimate: string;
    priority: string;
    action: string;
    risk: string;
    focusStage: string;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
};

export type LossRecoveryData = {
  mechanisms: Array<{
    label: string;
    trigger: string;
    worksWhen: string;
    cost: string;
    timing: string;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
  cases: Array<{
    label: string;
    condition: string;
    best: string[];
    avoid: string;
    rationale: string;
    metrics: Array<{
      label: string;
      value: string;
    }>;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
};

export type RecoveryMechanismData = {
  mechanism: "nack" | "pliFir" | "fec" | "plc";
  headline: string;
  scenario: string;
  flow: Array<{
    label: string;
    role: string;
    detail: string;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
  paths: Array<{
    label: string;
    direction: "forward" | "backward" | "local";
    payload: string;
    note: string;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
  rules: Array<{
    label: string;
    value: string;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
  caveat: string;
};

export type JitterBufferTuningData = {
  scenarios: Array<{
    label: string;
    network: string;
    bufferMs: number;
    jitterMs: number;
    freezeRate: string;
    mouthDelay: string;
    verdict: string;
    curve: number[];
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
};

export type AudioPreprocessingStrategyData = {
  scenarios: Array<{
    label: string;
    capture: string;
    risk: string;
    recommendation: string;
    settings: Array<{
      label: "AEC" | "AGC" | "NS";
      value: string;
      why: string;
      tone: "signal" | "protocol" | "warning" | "accent";
    }>;
    waveform: Array<{
      label: string;
      level: number;
      noise: number;
      tone: "signal" | "protocol" | "warning" | "accent";
    }>;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
};

export type RecoveryStrategySortData = {
  scenario: {
    label: string;
    stats: Array<{
      label: string;
      value: string;
      tone: "signal" | "protocol" | "warning" | "accent";
    }>;
  };
  strategies: Array<{
    label: string;
    defaultRank: number;
    locus: "audio" | "encoder" | "feedback" | "fec" | "route";
    rationale: string;
    sideEffect: string;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
};

export type LatencyOptimizationChecklistData = {
  goal: string;
  principle: string;
  stages: Array<{
    label: string;
    actor: string;
    event: string;
    wait: string;
    target: string;
    optimize: string;
    checks: string[];
    metric: string;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
};

export type SecurityPrivacyBoundaryData = {
  zones: Array<{
    label: string;
    owner: string;
    protects: string;
    exposed: string;
    action: string;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
  conflicts: Array<{
    label: string;
    question: string;
    tradeoff: string;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
};

export type DeploymentTopologyData = {
  modes: Array<{
    label: string;
    route: string;
    fit: string;
    strength: string;
    cost: string;
    nodes: string[];
    links: string[];
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
};

export type TestingToolchainData = {
  tools: Array<{
    label: string;
    stage: string;
    command: string;
    evidence: string;
    catches: string;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
};

export type MonitoringDashboardData = {
  metrics: Array<{
    label: string;
    formula: string;
    healthy: string;
    degraded: string;
    meaning: string;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
  samples: Array<{
    label: string;
    value: string;
    status: "good" | "warn" | "bad";
  }>;
};

export type SloLadderData = {
  tiers: Array<{
    label: string;
    promise: string;
    indicator: string;
    alert: string;
    degrade: string;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
};

export type IncidentTimelineData = {
  incident: string;
  steps: Array<{
    time: string;
    label: string;
    symptom: string;
    evidence: string;
    hypothesis: string;
    action: string;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
};

export type PracticeRunbookData = {
  topology: Array<{
    label: string;
    role: string;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
  steps: Array<{
    label: string;
    command: string;
    outcome: string;
    check: string;
    focusNode: string;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
};

export type SignalingServerWalkthroughData = {
  stages: Array<{
    label: string;
    trigger: string;
    state: string;
    relay: string;
    code: string[];
    guardrail: string;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
};

export type BrowserP2PWalkthroughData = {
  sequence: Array<{
    label: string;
    api: string;
    code: string;
    output: string;
    evidence: string;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
};

export type SfuCodeWalkthroughData = {
  concepts: Array<{
    label: string;
    api: string;
    direction: string;
    code: string;
    mediaEffect: string;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
  receivers: Array<{
    label: string;
    subscription: string;
    reason: string;
  }>;
};

export type ExperimentReviewData = {
  conditions: Array<{
    label: string;
    network: string;
    expectedStats: Array<{
      label: string;
      value: string;
    }>;
    likelyExperience: string;
    explanation: string;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
  assignment: Array<{
    label: string;
    output: string;
  }>;
};

export type EcosystemMapData = {
  routes: Array<{
    label: string;
    examples: string;
    bestFor: string;
    tradeoff: string;
    decisionSignal: string;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
  scenarios: Array<{
    label: string;
    recommendation: string;
    rationale: string;
  }>;
};

export type StandardsTimelineData = {
  milestones: Array<{
    year: string;
    label: string;
    detail: string;
    status: string;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
  trends: Array<{
    label: string;
    question: string;
    tension: string;
    tone: "signal" | "protocol" | "warning" | "accent";
  }>;
  exitPrompt: string[];
};

export type ReferenceFigureData = {
  instruction?: string;
  figures: Array<{
    src: string;
    alt: string;
    title: string;
    badge?: string;
    caption: string;
    takeaways: string[];
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
