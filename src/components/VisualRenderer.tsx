import type {
  ArchitectureDecisionData,
  AudioPreprocessingStrategyData,
  AudioProcessingData,
  BandwidthControlData,
  BrowserP2PWalkthroughData,
  CodecOverviewData,
  CodecTradeoffData,
  ConnectionTroubleshootingData,
  CourseRhythmData,
  DeploymentTopologyData,
  EcosystemMapData,
  ExperimentReviewData,
  HybridArchitectureData,
  IcePathData,
  IncidentTimelineData,
  InteractionCommand,
  JitterBufferTuningData,
  JitterSyncData,
  LatencyOptimizationChecklistData,
  LatencyBudgetData,
  LearningMapData,
  LayeredEncodingData,
  LossRecoveryData,
  MediaTopologyComparisonData,
  MeshArchitectureData,
  MonitoringDashboardData,
  OfferAnswerData,
  PracticeRunbookData,
  ProtocolFlowData,
  ProtocolStackData,
  QosQoeMatrixData,
  ReferenceFigureData,
  RecoveryStrategySortData,
  RecoveryMechanismData,
  RtcScopeData,
  ScenarioMapData,
  SecureChannelData,
  SecurityPrivacyBoundaryData,
  SignalChainData,
  SignalingServerWalkthroughData,
  SignalingBoundaryData,
  SfuArchitectureData,
  SfuCodeWalkthroughData,
  SloLadderData,
  StandardsTimelineData,
  StudentPromptData,
  TestingToolchainData,
  VideoParametersData,
  VisualSpec,
} from "../types";
import {
  ArchitectureDecision,
  AudioPreprocessingStrategy,
  AudioProcessing,
  BandwidthControl,
  BrowserP2PWalkthrough,
  CodecOverview,
  CodecTradeoff,
  ConnectionTroubleshooting,
  CourseRhythm,
  DeploymentTopology,
  EcosystemMap,
  ExperimentReview,
  HybridArchitecture,
  IcePath,
  IncidentTimeline,
  JitterBufferTuning,
  JitterSync,
  LatencyOptimizationChecklist,
  LatencyBudget,
  LayeredEncoding,
  LearningMap,
  LossRecovery,
  MediaTopologyComparison,
  MeshArchitecture,
  MonitoringDashboard,
  OfferAnswer,
  PracticeRunbook,
  ProtocolFlow,
  ProtocolStack,
  QosQoeMatrix,
  ReferenceFigure,
  RecoveryMechanism,
  RecoveryStrategySort,
  RtcScope,
  ScenarioMap,
  SecureChannel,
  SecurityPrivacyBoundary,
  SignalChain,
  SignalingServerWalkthrough,
  SignalingBoundary,
  SfuArchitecture,
  SfuCodeWalkthrough,
  SloLadder,
  StandardsTimeline,
  StudentPrompt,
  TestingToolchain,
  VideoParameters,
} from "./visuals";

type VisualRendererProps = {
  interactionCommand: InteractionCommand;
  visual: VisualSpec;
};

export function VisualRenderer({ interactionCommand, visual }: VisualRendererProps) {
  switch (visual.type) {
    case "learningMap":
      return (
        <LearningMap
          data={visual.data as LearningMapData}
          interactionCommand={interactionCommand}
        />
      );
    case "courseRhythm":
      return (
        <CourseRhythm
          data={visual.data as CourseRhythmData}
          interactionCommand={interactionCommand}
        />
      );
    case "rtcScope":
      return (
        <RtcScope
          data={visual.data as RtcScopeData}
          interactionCommand={interactionCommand}
        />
      );
    case "scenarioMap":
      return (
        <ScenarioMap
          data={visual.data as ScenarioMapData}
          interactionCommand={interactionCommand}
        />
      );
    case "studentPrompt":
      return (
        <StudentPrompt
          data={visual.data as StudentPromptData}
          interactionCommand={interactionCommand}
        />
      );
    case "protocolStack":
      return (
        <ProtocolStack
          data={visual.data as ProtocolStackData}
          interactionCommand={interactionCommand}
        />
      );
    case "protocolFlow":
      return (
        <ProtocolFlow
          data={visual.data as ProtocolFlowData}
          interactionCommand={interactionCommand}
        />
      );
    case "offerAnswer":
      return (
        <OfferAnswer
          data={visual.data as OfferAnswerData}
          interactionCommand={interactionCommand}
        />
      );
    case "signalingBoundary":
      return (
        <SignalingBoundary
          data={visual.data as SignalingBoundaryData}
          interactionCommand={interactionCommand}
        />
      );
    case "icePath":
      return (
        <IcePath
          data={visual.data as IcePathData}
          interactionCommand={interactionCommand}
        />
      );
    case "connectionTroubleshooting":
      return (
        <ConnectionTroubleshooting
          data={visual.data as ConnectionTroubleshootingData}
          interactionCommand={interactionCommand}
        />
      );
    case "secureChannel":
      return (
        <SecureChannel
          data={visual.data as SecureChannelData}
          interactionCommand={interactionCommand}
        />
      );
    case "meshArchitecture":
      return (
        <MeshArchitecture
          data={visual.data as MeshArchitectureData}
          interactionCommand={interactionCommand}
        />
      );
    case "sfuArchitecture":
      return (
        <SfuArchitecture
          data={visual.data as SfuArchitectureData}
          interactionCommand={interactionCommand}
        />
      );
    case "mediaTopologyComparison":
      return (
        <MediaTopologyComparison
          data={visual.data as MediaTopologyComparisonData}
          interactionCommand={interactionCommand}
        />
      );
    case "hybridArchitecture":
      return (
        <HybridArchitecture
          data={visual.data as HybridArchitectureData}
          interactionCommand={interactionCommand}
        />
      );
    case "architectureDecision":
      return (
        <ArchitectureDecision
          data={visual.data as ArchitectureDecisionData}
          interactionCommand={interactionCommand}
        />
      );
    case "codecOverview":
      return (
        <CodecOverview
          data={visual.data as CodecOverviewData}
          interactionCommand={interactionCommand}
        />
      );
    case "audioProcessing":
      return (
        <AudioProcessing
          data={visual.data as AudioProcessingData}
          interactionCommand={interactionCommand}
        />
      );
    case "videoParameters":
      return (
        <VideoParameters
          data={visual.data as VideoParametersData}
          interactionCommand={interactionCommand}
        />
      );
    case "layeredEncoding":
      return (
        <LayeredEncoding
          data={visual.data as LayeredEncodingData}
          interactionCommand={interactionCommand}
        />
      );
    case "codecTradeoff":
      return (
        <CodecTradeoff
          data={visual.data as CodecTradeoffData}
          interactionCommand={interactionCommand}
        />
      );
    case "bandwidthControl":
      return (
        <BandwidthControl
          data={visual.data as BandwidthControlData}
          interactionCommand={interactionCommand}
        />
      );
    case "lossRecovery":
      return (
        <LossRecovery
          data={visual.data as LossRecoveryData}
          interactionCommand={interactionCommand}
        />
      );
    case "recoveryMechanism":
      return (
        <RecoveryMechanism
          data={visual.data as RecoveryMechanismData}
          interactionCommand={interactionCommand}
        />
      );
    case "jitterBufferTuning":
      return (
        <JitterBufferTuning
          data={visual.data as JitterBufferTuningData}
          interactionCommand={interactionCommand}
        />
      );
    case "audioPreprocessingStrategy":
      return (
        <AudioPreprocessingStrategy
          data={visual.data as AudioPreprocessingStrategyData}
          interactionCommand={interactionCommand}
        />
      );
    case "recoveryStrategySort":
      return (
        <RecoveryStrategySort
          data={visual.data as RecoveryStrategySortData}
          interactionCommand={interactionCommand}
        />
      );
    case "latencyOptimizationChecklist":
      return (
        <LatencyOptimizationChecklist
          data={visual.data as LatencyOptimizationChecklistData}
          interactionCommand={interactionCommand}
        />
      );
    case "securityPrivacyBoundary":
      return (
        <SecurityPrivacyBoundary
          data={visual.data as SecurityPrivacyBoundaryData}
          interactionCommand={interactionCommand}
        />
      );
    case "deploymentTopology":
      return (
        <DeploymentTopology
          data={visual.data as DeploymentTopologyData}
          interactionCommand={interactionCommand}
        />
      );
    case "testingToolchain":
      return (
        <TestingToolchain
          data={visual.data as TestingToolchainData}
          interactionCommand={interactionCommand}
        />
      );
    case "monitoringDashboard":
      return (
        <MonitoringDashboard
          data={visual.data as MonitoringDashboardData}
          interactionCommand={interactionCommand}
        />
      );
    case "sloLadder":
      return (
        <SloLadder
          data={visual.data as SloLadderData}
          interactionCommand={interactionCommand}
        />
      );
    case "incidentTimeline":
      return (
        <IncidentTimeline
          data={visual.data as IncidentTimelineData}
          interactionCommand={interactionCommand}
        />
      );
    case "practiceRunbook":
      return (
        <PracticeRunbook
          data={visual.data as PracticeRunbookData}
          interactionCommand={interactionCommand}
        />
      );
    case "signalingServerWalkthrough":
      return (
        <SignalingServerWalkthrough
          data={visual.data as SignalingServerWalkthroughData}
          interactionCommand={interactionCommand}
        />
      );
    case "browserP2PWalkthrough":
      return (
        <BrowserP2PWalkthrough
          data={visual.data as BrowserP2PWalkthroughData}
          interactionCommand={interactionCommand}
        />
      );
    case "sfuCodeWalkthrough":
      return (
        <SfuCodeWalkthrough
          data={visual.data as SfuCodeWalkthroughData}
          interactionCommand={interactionCommand}
        />
      );
    case "experimentReview":
      return (
        <ExperimentReview
          data={visual.data as ExperimentReviewData}
          interactionCommand={interactionCommand}
        />
      );
    case "ecosystemMap":
      return (
        <EcosystemMap
          data={visual.data as EcosystemMapData}
          interactionCommand={interactionCommand}
        />
      );
    case "standardsTimeline":
      return (
        <StandardsTimeline
          data={visual.data as StandardsTimelineData}
          interactionCommand={interactionCommand}
        />
      );
    case "referenceFigure":
      return (
        <ReferenceFigure
          data={visual.data as ReferenceFigureData}
          interactionCommand={interactionCommand}
        />
      );
    case "signalChain":
      return (
        <SignalChain
          data={visual.data as SignalChainData}
          interactionCommand={interactionCommand}
        />
      );
    case "latencyBudget":
      return (
        <LatencyBudget
          data={visual.data as LatencyBudgetData}
          interactionCommand={interactionCommand}
        />
      );
    case "jitterSync":
      return (
        <JitterSync
          data={visual.data as JitterSyncData}
          interactionCommand={interactionCommand}
        />
      );
    case "qosQoeMatrix":
      return (
        <QosQoeMatrix
          data={visual.data as QosQoeMatrixData}
          interactionCommand={interactionCommand}
        />
      );
    default:
      return null;
  }
}
