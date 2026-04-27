import type {
  ArchitectureDecisionData,
  AudioProcessingData,
  CodecOverviewData,
  CodecTradeoffData,
  ConnectionTroubleshootingData,
  CourseRhythmData,
  HybridArchitectureData,
  IcePathData,
  InteractionCommand,
  JitterSyncData,
  LatencyBudgetData,
  LearningMapData,
  LayeredEncodingData,
  MediaTopologyComparisonData,
  MeshArchitectureData,
  OfferAnswerData,
  ProtocolFlowData,
  ProtocolStackData,
  QosQoeMatrixData,
  RtcScopeData,
  ScenarioMapData,
  SecureChannelData,
  SignalChainData,
  SignalingBoundaryData,
  SfuArchitectureData,
  StudentPromptData,
  VideoParametersData,
  VisualSpec,
} from "../types";
import {
  ArchitectureDecision,
  AudioProcessing,
  CodecOverview,
  CodecTradeoff,
  ConnectionTroubleshooting,
  CourseRhythm,
  HybridArchitecture,
  IcePath,
  JitterSync,
  LatencyBudget,
  LayeredEncoding,
  LearningMap,
  MediaTopologyComparison,
  MeshArchitecture,
  OfferAnswer,
  ProtocolFlow,
  ProtocolStack,
  QosQoeMatrix,
  RtcScope,
  ScenarioMap,
  SecureChannel,
  SignalChain,
  SignalingBoundary,
  SfuArchitecture,
  StudentPrompt,
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
