import type { PeerInfo, SignalPayload, VideoCodecPreference } from "./types";

type PeerSessionOptions = {
  peer: PeerInfo;
  localStream: MediaStream;
  preferredVideoCodec?: VideoCodecPreference;
  sendSignal: (to: string, payload: SignalPayload) => void;
  onUpdate: () => void;
};

type CodecPreferenceResult = {
  ok: boolean;
  message: string;
};

export type PeerSession = {
  peer: PeerInfo;
  pc: RTCPeerConnection;
  remoteStream: MediaStream;
  codecPreference: CodecPreferenceResult;
  getState: () => {
    connectionState: RTCPeerConnectionState;
    iceConnectionState: RTCIceConnectionState;
  };
  startOffer: () => Promise<void>;
  handleSignal: (payload: SignalPayload) => Promise<void>;
  getVideoSenders: () => RTCRtpSender[];
  getAudioSenders: () => RTCRtpSender[];
  replaceAudioTrack: (track: MediaStreamTrack, stream: MediaStream) => Promise<void>;
  replaceVideoTrack: (track: MediaStreamTrack, stream: MediaStream) => Promise<void>;
  close: () => void;
};

const rtcConfig: RTCConfiguration = {
  iceServers: [],
};

const addLocalTracks = (pc: RTCPeerConnection, localStream: MediaStream) => {
  for (const track of localStream.getTracks()) {
    pc.addTrack(track, localStream);
  }
};

const codecMimeFor = (codec: VideoCodecPreference) => `video/${codec.toLowerCase()}`;

const applyVideoCodecPreference = (
  pc: RTCPeerConnection,
  preferredVideoCodec?: VideoCodecPreference,
): CodecPreferenceResult => {
  if (!preferredVideoCodec) return { ok: true, message: "browser default" };

  const capabilities = RTCRtpSender.getCapabilities("video");
  const codecs = capabilities?.codecs ?? [];
  const preferredMime = codecMimeFor(preferredVideoCodec);
  const preferred = codecs.filter(
    (codec) => codec.mimeType.toLowerCase() === preferredMime,
  );

  if (preferred.length === 0) {
    return {
      ok: false,
      message: `${preferredVideoCodec} is not supported by this browser.`,
    };
  }

  try {
    for (const transceiver of pc.getTransceivers()) {
      if (transceiver.sender.track?.kind === "video") {
        transceiver.setCodecPreferences(preferred);
      }
    }
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error
        ? error.message
        : `${preferredVideoCodec} codec preference failed.`,
    };
  }

  return { ok: true, message: `${preferredVideoCodec} preferred` };
};

export const createPeerSession = ({
  peer,
  localStream,
  preferredVideoCodec,
  sendSignal,
  onUpdate,
}: PeerSessionOptions): PeerSession => {
  const pc = new RTCPeerConnection(rtcConfig);
  const remoteStream = new MediaStream();
  const pendingCandidates: RTCIceCandidateInit[] = [];
  let signalQueue = Promise.resolve();

  addLocalTracks(pc, localStream);
  const codecPreference = applyVideoCodecPreference(pc, preferredVideoCodec);

  pc.addEventListener("icecandidate", (event) => {
    if (event.candidate) {
      sendSignal(peer.peerId, {
        type: "candidate",
        candidate: event.candidate.toJSON(),
      });
    }
  });

  pc.addEventListener("track", (event) => {
    for (const track of event.streams[0]?.getTracks() ?? [event.track]) {
      if (!remoteStream.getTrackById(track.id)) {
        remoteStream.addTrack(track);
      }
    }
    onUpdate();
  });

  pc.addEventListener("connectionstatechange", onUpdate);
  pc.addEventListener("iceconnectionstatechange", onUpdate);

  const sendLocalDescription = () => {
    if (!pc.localDescription) return;
    sendSignal(peer.peerId, {
      type: pc.localDescription.type as "offer" | "answer",
      description: pc.localDescription.toJSON(),
    });
  };

  const renegotiate = async () => {
    if (pc.signalingState !== "stable") return;
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    sendLocalDescription();
  };

  const replaceLocalTrack = async (
    kind: MediaStreamTrack["kind"],
    track: MediaStreamTrack,
    stream: MediaStream,
  ) => {
    const senders = pc
      .getSenders()
      .filter((sender) => sender.track?.kind === kind);

    if (senders.length > 0) {
      await Promise.all(senders.map((sender) => sender.replaceTrack(track)));
      return;
    }

    pc.addTrack(track, stream);
    await renegotiate();
  };

  const applyPendingCandidates = async () => {
    while (pendingCandidates.length) {
      const candidate = pendingCandidates.shift();
      if (candidate) await pc.addIceCandidate(candidate);
    }
  };

  const applySignal = async (payload: SignalPayload) => {
    if (payload.type === "candidate") {
      if (payload.candidate) {
        if (pc.remoteDescription) {
          await pc.addIceCandidate(payload.candidate);
        } else {
          pendingCandidates.push(payload.candidate);
        }
      }
      return;
    }

    if (payload.type === "offer") {
      if (pc.signalingState !== "stable") return;
      await pc.setRemoteDescription(payload.description);
      await applyPendingCandidates();
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      sendLocalDescription();
      return;
    }

    if (pc.signalingState !== "have-local-offer") return;
    await pc.setRemoteDescription(payload.description);
    await applyPendingCandidates();
  };

  const enqueueSignal = (payload: SignalPayload) => {
    const next = signalQueue.then(
      () => applySignal(payload),
      () => applySignal(payload),
    );
    signalQueue = next.catch(() => undefined);
    return next;
  };

  return {
    peer,
    pc,
    remoteStream,
    codecPreference,
    getState: () => ({
      connectionState: pc.connectionState,
      iceConnectionState: pc.iceConnectionState,
    }),
    startOffer: async () => {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      sendLocalDescription();
    },
    handleSignal: enqueueSignal,
    getVideoSenders: () =>
      pc.getSenders().filter((sender) => sender.track?.kind === "video"),
    getAudioSenders: () =>
      pc.getSenders().filter((sender) => sender.track?.kind === "audio"),
    replaceAudioTrack: (track, stream) => replaceLocalTrack("audio", track, stream),
    replaceVideoTrack: (track, stream) => replaceLocalTrack("video", track, stream),
    close: () => {
      pc.close();
    },
  };
};
