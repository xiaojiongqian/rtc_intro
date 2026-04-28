export type PeerInfo = {
  peerId: string;
  displayName: string;
  joinedAt: number;
};

export type SignalPayload =
  | {
      type: "offer" | "answer";
      description: RTCSessionDescriptionInit;
    }
  | {
      type: "candidate";
      candidate: RTCIceCandidateInit;
    };

export type RoomMessage = {
  type: "room";
  roomId: string;
  peerId: string;
  maxPeers: 4;
  peers: PeerInfo[];
};

export type PeerJoinedMessage = {
  type: "peer-joined";
  peer: PeerInfo;
};

export type PeerLeftMessage = {
  type: "peer-left";
  peerId: string;
};

export type RelayedSignalMessage = {
  type: "signal";
  from: string;
  payload: SignalPayload;
};

export type SignalingErrorMessage = {
  type: "error";
  code: "room-full" | "invalid-message" | "peer-not-found";
  message: string;
};

export type SignalingServerMessage =
  | RoomMessage
  | PeerJoinedMessage
  | PeerLeftMessage
  | RelayedSignalMessage
  | SignalingErrorMessage;

export type LabConnectionStatus =
  | "idle"
  | "media"
  | "signaling"
  | "joined"
  | "leaving"
  | "error";

export type LocalMediaMode = "camera" | "audio-only" | "video-only" | "demo";

export type MediaInputDeviceOption = {
  deviceId: string;
  label: string;
  kind: "audioinput" | "videoinput";
};

export type MediaDeviceSelection = {
  audioEnabled: boolean;
  videoEnabled: boolean;
  audioDeviceId?: string;
  videoDeviceId?: string;
};

export type MediaDevicePickerState = {
  open: boolean;
  loading: boolean;
  error: string | null;
  audioInputs: MediaInputDeviceOption[];
  videoInputs: MediaInputDeviceOption[];
};

export type RtcStatsSnapshot = {
  timestamp: number;
  connection: {
    state: RTCPeerConnectionState;
    iceState: RTCIceConnectionState;
    candidateType?: string;
    currentRoundTripTimeMs?: number;
    availableOutgoingBitrateKbps?: number;
  };
  outbound: {
    audioBitrateKbps?: number;
    videoBitrateKbps?: number;
    framesPerSecond?: number;
    frameWidth?: number;
    frameHeight?: number;
    packetsSent?: number;
    bytesSent?: number;
    nackCount?: number;
    pliCount?: number;
    firCount?: number;
    codec?: string;
  };
  inbound: {
    audioBitrateKbps?: number;
    videoBitrateKbps?: number;
    packetsReceived?: number;
    packetsLost?: number;
    packetLossRate?: number;
    jitterMs?: number;
    jitterBufferDelayMs?: number;
    framesDecoded?: number;
    framesPerSecond?: number;
    framesDropped?: number;
    freezeCount?: number;
    concealedSamples?: number;
    concealmentRate?: number;
    codec?: string;
  };
};

export type PeerSessionState = {
  peer: PeerInfo;
  remoteStream: MediaStream;
  connectionState: RTCPeerConnectionState;
  iceConnectionState: RTCIceConnectionState;
  stats?: RtcStatsSnapshot;
};

export type RoomStatsSnapshot = {
  peerCount: number;
  activeConnections: number;
  theoreticalConnections: number;
  totalOutgoingKbps?: number;
  totalIncomingKbps?: number;
  worstRttMs?: number;
  worstLossRate?: number;
  averageInboundFps?: number;
};

export type DegradationPreference =
  | "balanced"
  | "maintain-framerate"
  | "maintain-resolution";

export type VideoContentHint = "" | "motion" | "detail" | "text";

export type VideoCodecPreference = "VP8" | "H264" | "VP9" | "AV1";

export type QosControlState = {
  video: {
    maxBitrateKbps: number;
    maxFramerate: number;
    scaleResolutionDownBy: number;
    degradationPreference: DegradationPreference;
    contentHint: VideoContentHint;
  };
  audio: {
    echoCancellation: boolean;
    noiseSuppression: boolean;
    autoGainControl: boolean;
  };
  codec: {
    preferredVideoCodec?: VideoCodecPreference;
    requiresRestart: boolean;
  };
};

export type QosPreset = {
  id: string;
  label: string;
  description: string;
  state: QosControlState["video"];
};

export type QosApplyResult = {
  ok: boolean;
  message: string;
};
