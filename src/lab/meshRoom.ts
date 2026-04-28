import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  applyContentHint,
  applyVideoQos,
  audioConstraintsFromQos,
  defaultQosState,
  videoConstraintsFromQos,
} from "./qosControls";
import { createPeerSession, type PeerSession } from "./peerSession";
import {
  aggregateRoomStats,
  collectStats,
  type StatsBaseline,
} from "./statsCollector";
import {
  createSignalingClient,
  type SignalingClient,
} from "./signalingClient";
import type {
  LabConnectionStatus,
  LocalMediaMode,
  MediaDevicePickerState,
  MediaDeviceSelection,
  MediaInputDeviceOption,
  PeerInfo,
  PeerSessionState,
  QosControlState,
  RoomStatsSnapshot,
  SignalPayload,
} from "./types";

const createPeerId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `peer-${Math.random().toString(36).slice(2, 10)}`;

const createDefaultName = () => `Peer ${Math.floor(Math.random() * 900 + 100)}`;

const displayNameStorageKey = "rtc-lab-display-name";
const peerIdStorageKey = "rtc-lab-peer-id";
const legacyPeerStorageKey = "rtc-lab-peer";
const deviceSelectionStorageKey = "rtc-lab-device-selection";

const defaultDeviceSelection: MediaDeviceSelection = {
  audioEnabled: true,
  videoEnabled: true,
};

const getSavedDisplayName = () => {
  const savedName = window.localStorage.getItem(displayNameStorageKey);
  if (savedName) return savedName;

  const legacyPeer = window.localStorage.getItem(legacyPeerStorageKey);
  if (legacyPeer) {
    try {
      const parsed = JSON.parse(legacyPeer) as Partial<PeerInfo>;
      if (parsed.displayName) return parsed.displayName;
    } catch {
      window.localStorage.removeItem(legacyPeerStorageKey);
    }
  }

  return createDefaultName();
};

const getInitialPeer = (): PeerInfo => {
  const peerId = window.sessionStorage.getItem(peerIdStorageKey) ?? createPeerId();
  window.sessionStorage.setItem(peerIdStorageKey, peerId);
  const peer = {
    peerId,
    displayName: getSavedDisplayName(),
    joinedAt: Date.now(),
  };
  return peer;
};

const getInitialDeviceSelection = (): MediaDeviceSelection => {
  const saved = window.localStorage.getItem(deviceSelectionStorageKey);
  if (!saved) return defaultDeviceSelection;

  try {
    return {
      ...defaultDeviceSelection,
      ...(JSON.parse(saved) as Partial<MediaDeviceSelection>),
    };
  } catch {
    window.localStorage.removeItem(deviceSelectionStorageKey);
    return defaultDeviceSelection;
  }
};

const stopStream = (stream: MediaStream | null) => {
  for (const track of stream?.getTracks() ?? []) track.stop();
};

const isPermissionDeniedError = (error: unknown) =>
  error instanceof DOMException &&
  (error.name === "NotAllowedError" || error.name === "SecurityError");

const deviceLabel = (
  device: MediaDeviceInfo,
  index: number,
  fallback: string,
) => device.label || `${fallback} ${index + 1}`;

const normalizeDeviceSelection = (
  selection: MediaDeviceSelection,
  audioInputs: MediaInputDeviceOption[],
  videoInputs: MediaInputDeviceOption[],
): MediaDeviceSelection => ({
  audioEnabled: audioInputs.length > 0 ? selection.audioEnabled : false,
  videoEnabled: videoInputs.length > 0 ? selection.videoEnabled : false,
  audioDeviceId: audioInputs.some(
    (device) => device.deviceId === selection.audioDeviceId,
  )
    ? selection.audioDeviceId
    : undefined,
  videoDeviceId: videoInputs.some(
    (device) => device.deviceId === selection.videoDeviceId,
  )
    ? selection.videoDeviceId
    : undefined,
});

const createDemoMediaStream = (label: string) => {
  const canvas = document.createElement("canvas");
  canvas.width = 960;
  canvas.height = 540;
  const context = canvas.getContext("2d");
  let frame = 0;

  const draw = () => {
    if (!context) return;
    const hue = (frame * 2) % 360;
    context.fillStyle = `hsl(${hue} 28% 16%)`;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#2ee59d";
    context.fillRect(0, canvas.height - 92, canvas.width, 92);
    context.fillStyle = "#f5f2ea";
    context.font = "600 46px sans-serif";
    context.fillText("WebRTC Lab Demo Stream", 48, 92);
    context.font = "32px sans-serif";
    context.fillText(label, 48, 148);
    context.fillStyle = "#111217";
    context.font = "700 42px sans-serif";
    context.fillText(`frame ${frame}`, 48, canvas.height - 34);
    frame += 1;
  };

  draw();
  const timer = window.setInterval(draw, 250);
  const stream = canvas.captureStream(12);
  for (const track of stream.getVideoTracks()) {
    track.addEventListener("ended", () => window.clearInterval(timer), { once: true });
  }
  return stream;
};

const mediaModeFromStream = (stream: MediaStream): LocalMediaMode => {
  const hasAudio = stream.getAudioTracks().length > 0;
  const hasVideo = stream.getVideoTracks().length > 0;
  if (hasAudio && hasVideo) return "camera";
  if (hasAudio) return "audio-only";
  if (hasVideo) return "video-only";
  return "demo";
};

const realMediaNotice = (mode: LocalMediaMode) => {
  if (mode === "camera") return "已切换到真实摄像头/麦克风设备。";
  if (mode === "audio-only") return "浏览器仅返回麦克风 track，当前为纯音频模式。";
  if (mode === "video-only") return "浏览器仅返回摄像头 track，当前为纯视频模式。";
  return "已切换本地媒体流。";
};

const mediaErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "unknown media error";

const assertMediaDevicesAvailable = () => {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error("浏览器未开放媒体设备 API，请使用 localhost 或 HTTPS 打开实验台。");
  }
};

const audioConstraintsFor = (
  qos: QosControlState,
  selection: MediaDeviceSelection,
): MediaTrackConstraints | false => {
  if (!selection.audioEnabled) return false;
  return {
    ...audioConstraintsFromQos(qos.audio),
    ...(selection.audioDeviceId
      ? { deviceId: { exact: selection.audioDeviceId } }
      : {}),
  };
};

const videoConstraintsFor = (
  qos: QosControlState,
  selection: MediaDeviceSelection,
): MediaTrackConstraints | false => {
  if (!selection.videoEnabled) return false;
  return {
    ...videoConstraintsFromQos(qos.video),
    ...(selection.videoDeviceId
      ? { deviceId: { exact: selection.videoDeviceId } }
      : {}),
  };
};

const requestDevicePermissionProbe = async () => {
  assertMediaDevicesAvailable();
  const attempts: MediaStreamConstraints[] = [
    { audio: true, video: true },
    { audio: true, video: false },
    { audio: false, video: true },
  ];

  for (const constraints of attempts) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      stopStream(stream);
      return;
    } catch (error) {
      if (isPermissionDeniedError(error)) throw error;
    }
  }
};

const enumerateInputDevices = async () => {
  assertMediaDevicesAvailable();
  await requestDevicePermissionProbe();
  const devices = await navigator.mediaDevices.enumerateDevices();
  const audioInputs = devices
    .filter((device) => device.kind === "audioinput")
    .map((device, index) => ({
      deviceId: device.deviceId,
      label: deviceLabel(device, index, "麦克风"),
      kind: "audioinput" as const,
    }));
  const videoInputs = devices
    .filter((device) => device.kind === "videoinput")
    .map((device, index) => ({
      deviceId: device.deviceId,
      label: deviceLabel(device, index, "摄像头"),
      kind: "videoinput" as const,
    }));
  return { audioInputs, videoInputs };
};

const acquireRealMedia = async (
  qos: QosControlState,
  selection: MediaDeviceSelection,
): Promise<{ stream: MediaStream; mode: LocalMediaMode; message?: string }> => {
  assertMediaDevicesAvailable();

  const audio = audioConstraintsFor(qos, selection);
  const video = videoConstraintsFor(qos, selection);
  if (!audio && !video) {
    throw new Error("请至少启用摄像头或麦克风。");
  }

  const attempts: Array<{
    constraints: MediaStreamConstraints;
    message?: string;
  }> = [];
  if (audio && video) {
    attempts.push({ constraints: { audio, video } });
  }
  if (audio) {
    attempts.push({
      constraints: { audio, video: false },
      message: video
        ? "未能打开所选摄像头，已使用麦克风继续。视频墙会显示本地空位。"
        : undefined,
    });
  }
  if (video) {
    attempts.push({
      constraints: { audio: false, video },
      message: audio ? "未能打开所选麦克风，已使用摄像头继续。" : undefined,
    });
  }

  let firstError: unknown = null;

  for (const attempt of attempts) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(attempt.constraints);
      const mode = mediaModeFromStream(stream);
      return {
        stream,
        mode,
        message: attempt.message ?? (mode === "camera" ? undefined : realMediaNotice(mode)),
      };
    } catch (error) {
      firstError ??= error;
    }
  }

  throw new Error(`未找到可用摄像头/麦克风：${mediaErrorMessage(firstError)}`);
};

const acquireLocalMedia = async (
  qos: QosControlState,
  label: string,
  selection: MediaDeviceSelection,
): Promise<{ stream: MediaStream; mode: LocalMediaMode; message?: string }> => {
  try {
    return await acquireRealMedia(qos, selection);
  } catch (mediaError) {
    return {
      stream: createDemoMediaStream(label),
      mode: "demo",
      message: `${mediaErrorMessage(mediaError)}。已自动启用演示视频流，可点击“打开设备”选择摄像头/麦克风。`,
    };
  }
};

const sessionStateFrom = (
  session: PeerSession,
  stats?: PeerSessionState["stats"],
): PeerSessionState => {
  const state = session.getState();
  return {
    peer: session.peer,
    remoteStream: session.remoteStream,
    connectionState: state.connectionState,
    iceConnectionState: state.iceConnectionState,
    stats,
  };
};

export const useMeshRoom = () => {
  const [localPeer, setLocalPeer] = useState(getInitialPeer);
  const [roomId, setRoomId] = useState("rtc-lab");
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [localMediaMode, setLocalMediaMode] = useState<LocalMediaMode>("camera");
  const [mediaNotice, setMediaNotice] = useState<string | null>(null);
  const [status, setStatus] = useState<LabConnectionStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [maxPeers, setMaxPeers] = useState(4);
  const [remotePeers, setRemotePeers] = useState<PeerInfo[]>([]);
  const [sessions, setSessions] = useState<PeerSessionState[]>([]);
  const [qos, setQos] = useState<QosControlState>(defaultQosState);
  const [qosMessage, setQosMessage] = useState("QoS controls are ready.");
  const [deviceSelection, setDeviceSelectionState] = useState(
    getInitialDeviceSelection,
  );
  const [devicePicker, setDevicePicker] = useState<MediaDevicePickerState>({
    open: false,
    loading: false,
    error: null,
    audioInputs: [],
    videoInputs: [],
  });

  const localStreamRef = useRef<MediaStream | null>(null);
  const clientRef = useRef<SignalingClient | null>(null);
  const sessionsRef = useRef(new Map<string, PeerSession>());
  const peersRef = useRef(new Map<string, PeerInfo>());
  const statsRef = useRef(new Map<string, PeerSessionState["stats"]>());
  const baselinesRef = useRef(new Map<string, StatsBaseline>());
  const qosRef = useRef(qos);
  const deviceSelectionRef = useRef(deviceSelection);

  useEffect(() => {
    qosRef.current = qos;
  }, [qos]);

  useEffect(() => {
    deviceSelectionRef.current = deviceSelection;
  }, [deviceSelection]);

  const setDeviceSelection = useCallback((next: MediaDeviceSelection) => {
    deviceSelectionRef.current = next;
    setDeviceSelectionState(next);
    window.localStorage.setItem(deviceSelectionStorageKey, JSON.stringify(next));
  }, []);

  const persistLocalPeer = useCallback((next: PeerInfo) => {
    setLocalPeer(next);
    window.sessionStorage.setItem(peerIdStorageKey, next.peerId);
    window.localStorage.setItem(displayNameStorageKey, next.displayName);
    window.localStorage.removeItem(legacyPeerStorageKey);
  }, []);

  const refreshSessions = useCallback(() => {
    setSessions(
      [...sessionsRef.current.values()].map((session) =>
        sessionStateFrom(session, statsRef.current.get(session.peer.peerId)),
      ),
    );
  }, []);

  const closeSession = useCallback(
    (peerId: string) => {
      sessionsRef.current.get(peerId)?.close();
      sessionsRef.current.delete(peerId);
      statsRef.current.delete(peerId);
      baselinesRef.current.delete(peerId);
      refreshSessions();
    },
    [refreshSessions],
  );

  const createSession = useCallback(
    (peer: PeerInfo) => {
      if (peer.peerId === localPeer.peerId) return null;
      const existing = sessionsRef.current.get(peer.peerId);
      if (existing) return existing;
      const stream = localStreamRef.current;
      const client = clientRef.current;
      if (!stream || !client) return null;

      const session = createPeerSession({
        peer,
        localStream: stream,
        preferredVideoCodec: qosRef.current.codec.preferredVideoCodec,
        sendSignal: client.sendSignal,
        onUpdate: refreshSessions,
      });
      if (qosRef.current.codec.preferredVideoCodec) {
        setQosMessage(
          session.codecPreference.ok
            ? `${qosRef.current.codec.preferredVideoCodec} will be negotiated in the next offer.`
            : session.codecPreference.message,
        );
      }
      sessionsRef.current.set(peer.peerId, session);
      peersRef.current.set(peer.peerId, peer);
      refreshSessions();
      return session;
    },
    [localPeer.peerId, refreshSessions],
  );

  const removePeer = useCallback(
    (peerId: string) => {
      peersRef.current.delete(peerId);
      closeSession(peerId);
      setRemotePeers([...peersRef.current.values()]);
    },
    [closeSession],
  );

  const handleSignal = useCallback(
    async (from: string, payload: SignalPayload) => {
      if (from === localPeer.peerId) return;

      const peer =
        peersRef.current.get(from) ??
        ({
          peerId: from,
          displayName: from.slice(0, 8),
          joinedAt: Date.now(),
        } satisfies PeerInfo);
      peersRef.current.set(from, peer);
      setRemotePeers([...peersRef.current.values()]);

      const session = createSession(peer);
      if (!session) return;

      try {
        await session.handleSignal(payload);
        refreshSessions();
      } catch (signalError) {
        setError(
          signalError instanceof Error
            ? signalError.message
            : "Failed to apply remote signal.",
        );
      }
    },
    [createSession, localPeer.peerId, refreshSessions],
  );

  const leaveRoom = useCallback(() => {
    setStatus((value) => (value === "idle" ? "idle" : "leaving"));
    clientRef.current?.leave();
    clientRef.current?.close();
    clientRef.current = null;

    for (const session of sessionsRef.current.values()) session.close();
    sessionsRef.current.clear();
    peersRef.current.clear();
    statsRef.current.clear();
    baselinesRef.current.clear();

    for (const track of localStreamRef.current?.getTracks() ?? []) track.stop();
    localStreamRef.current = null;
    setLocalStream(null);
    setLocalMediaMode("camera");
    setMediaNotice(null);
    setRemotePeers([]);
    setSessions([]);
    setStatus("idle");
  }, []);

  const replaceLocalStream = useCallback(
    async (
      stream: MediaStream,
      mode: LocalMediaMode,
      message: string | null,
    ) => {
      applyContentHint(stream, qosRef.current.video.contentHint);

      const previousStream = localStreamRef.current;
      const [videoTrack] = stream.getVideoTracks();
      const [audioTrack] = stream.getAudioTracks();
      const activeSessions = [...sessionsRef.current.values()];

      await Promise.all([
        ...activeSessions.map((session) =>
          videoTrack
            ? session.replaceVideoTrack(videoTrack, stream)
            : Promise.resolve(),
        ),
        ...activeSessions.map((session) =>
          audioTrack
            ? session.replaceAudioTrack(audioTrack, stream)
            : Promise.resolve(),
        ),
      ]);

      localStreamRef.current = stream;
      setLocalStream(stream);
      setLocalMediaMode(mode);
      setMediaNotice(message);

      for (const track of previousStream?.getTracks() ?? []) {
        track.stop();
      }
      refreshSessions();
    },
    [refreshSessions],
  );

  const openDevicePicker = useCallback(async () => {
    setError(null);
    setDevicePicker((value) => ({
      ...value,
      open: true,
      loading: true,
      error: null,
    }));

    try {
      const devices = await enumerateInputDevices();
      const nextSelection = normalizeDeviceSelection(
        deviceSelectionRef.current,
        devices.audioInputs,
        devices.videoInputs,
      );
      setDeviceSelection(nextSelection);
      setDevicePicker({
        open: true,
        loading: false,
        error: null,
        ...devices,
      });
    } catch (deviceError) {
      setDevicePicker((value) => ({
        ...value,
        open: true,
        loading: false,
        error:
          deviceError instanceof Error
            ? deviceError.message
            : "无法读取摄像头/麦克风列表。",
      }));
    }
  }, [setDeviceSelection]);

  const closeDevicePicker = useCallback(() => {
    setDevicePicker((value) => ({ ...value, open: false, error: null }));
  }, []);

  const applySelectedDevices = useCallback(async () => {
    setError(null);
    setMediaNotice("正在打开所选摄像头/麦克风...");
    setStatus((value) => (value === "idle" || value === "error" ? "media" : value));
    setDevicePicker((value) => ({ ...value, loading: true, error: null }));

    try {
      const media = await acquireRealMedia(
        qosRef.current,
        deviceSelectionRef.current,
      );
      await replaceLocalStream(
        media.stream,
        media.mode,
        media.message ?? realMediaNotice(media.mode),
      );
      setDevicePicker((value) => ({ ...value, open: false, loading: false }));
    } catch (mediaError) {
      const message = `${mediaErrorMessage(mediaError)}。请检查浏览器站点权限和系统摄像头/麦克风权限，或选择其他设备。`;
      setMediaNotice(
        message,
      );
      setDevicePicker((value) => ({
        ...value,
        loading: false,
        error: message,
      }));
    } finally {
      setStatus((value) =>
        value === "media" ? (clientRef.current ? "joined" : "idle") : value,
      );
    }
  }, [replaceLocalStream]);

  const joinRoom = useCallback(
    async (nextRoomId: string, nextDisplayName: string, signalingUrl: string) => {
      if (!nextRoomId.trim()) {
        setError("Room code is required.");
        return;
      }
      if (!signalingUrl.trim()) {
        setError("Signaling server URL is required.");
        return;
      }

      leaveRoom();
      setError(null);
      setStatus("media");

      const nextPeer = {
        ...localPeer,
        displayName: nextDisplayName.trim() || localPeer.displayName,
        joinedAt: Date.now(),
      };
      persistLocalPeer(nextPeer);
      setRoomId(nextRoomId.trim());

      try {
        const media = await acquireLocalMedia(
          qosRef.current,
          nextPeer.displayName,
          deviceSelectionRef.current,
        );
        await replaceLocalStream(media.stream, media.mode, media.message ?? null);
        if (qosRef.current.codec.preferredVideoCodec) {
          const nextQos = {
            ...qosRef.current,
            codec: { ...qosRef.current.codec, requiresRestart: false },
          };
          qosRef.current = nextQos;
          setQos(nextQos);
          setQosMessage(
            `${nextQos.codec.preferredVideoCodec} codec preference will be applied to new peer connections.`,
          );
        }
      } catch (mediaError) {
        setStatus("error");
        setError(
          mediaError instanceof Error
            ? mediaError.message
            : "Cannot access microphone or camera.",
        );
        return;
      }

      setStatus("signaling");
      const client = createSignalingClient({
        url: signalingUrl.trim(),
        roomId: nextRoomId.trim(),
        peerId: nextPeer.peerId,
        displayName: nextPeer.displayName,
        onRoom: (message) => {
          const roomPeers = message.peers.filter(
            (peer) => peer.peerId !== nextPeer.peerId,
          );
          setMaxPeers(message.maxPeers);
          peersRef.current = new Map(
            roomPeers.map((peer) => [peer.peerId, peer]),
          );
          setRemotePeers(roomPeers);
          setStatus("joined");

          for (const peer of roomPeers) {
            const session = createSession(peer);
            session?.startOffer().catch((offerError) => {
              setError(
                offerError instanceof Error
                  ? offerError.message
                  : "Failed to create offer.",
              );
            });
          }
        },
        onPeerJoined: (peer) => {
          if (peer.peerId === nextPeer.peerId) return;
          peersRef.current.set(peer.peerId, peer);
          setRemotePeers([...peersRef.current.values()]);
        },
        onPeerLeft: removePeer,
        onSignal: handleSignal,
        onError: (message) => {
          setStatus("error");
          setError(message.message);
          if (message.code === "room-full") {
            clientRef.current?.close();
            clientRef.current = null;
            for (const track of localStreamRef.current?.getTracks() ?? []) {
              track.stop();
            }
            localStreamRef.current = null;
            setLocalStream(null);
            setLocalMediaMode("camera");
            setMediaNotice(null);
          }
        },
        onStatus: (nextStatus) => {
          if (nextStatus === "closed" && status !== "idle") {
            setStatus("idle");
          }
        },
      });
      clientRef.current = client;
    },
    [
      createSession,
      handleSignal,
      leaveRoom,
      localPeer,
      persistLocalPeer,
      removePeer,
      replaceLocalStream,
      status,
    ],
  );

  useEffect(() => () => leaveRoom(), [leaveRoom]);

  useEffect(() => {
    if (status !== "joined") return undefined;
    const timer = window.setInterval(() => {
      const entries = [...sessionsRef.current.entries()];
      void Promise.all(
        entries.map(async ([peerId, session]) => {
          const result = await collectStats(
            session.pc,
            baselinesRef.current.get(peerId),
          );
          baselinesRef.current.set(peerId, result.baseline);
          statsRef.current.set(peerId, result.snapshot);
        }),
      ).then(refreshSessions);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [refreshSessions, status]);

  const allVideoSenders = useCallback(
    () => [...sessionsRef.current.values()].flatMap((session) => session.getVideoSenders()),
    [],
  );

  const updateVideoQos = useCallback(
    async (patch: Partial<QosControlState["video"]>) => {
      const next = {
        ...qosRef.current,
        video: { ...qosRef.current.video, ...patch },
      };
      qosRef.current = next;
      setQos(next);
      applyContentHint(localStreamRef.current, next.video.contentHint);
      const results = await applyVideoQos(allVideoSenders(), next.video);
      setQosMessage(
        results.every((result) => result.ok)
          ? "Video QoS applied to active senders."
          : results.map((result) => result.message).join(" "),
      );
    },
    [allVideoSenders],
  );

  const updateAudioQos = useCallback(
    async (patch: Partial<QosControlState["audio"]>) => {
      const next = {
        ...qosRef.current,
        audio: { ...qosRef.current.audio, ...patch },
      };
      qosRef.current = next;
      setQos(next);

      if (!localStreamRef.current) return;

      try {
        const audioConstraints = audioConstraintsFor(next, deviceSelectionRef.current);
        if (!audioConstraints) {
          setQosMessage("Microphone is disabled in device selection.");
          return;
        }
        const replacement = await navigator.mediaDevices.getUserMedia({
          audio: audioConstraints,
          video: false,
        });
        const [newAudioTrack] = replacement.getAudioTracks();
        if (!newAudioTrack) return;

        for (const oldTrack of localStreamRef.current.getAudioTracks()) {
          oldTrack.stop();
          localStreamRef.current.removeTrack(oldTrack);
        }
        localStreamRef.current.addTrack(newAudioTrack);

        await Promise.all(
          [...sessionsRef.current.values()].map((session) =>
            session.replaceAudioTrack(newAudioTrack, localStreamRef.current!),
          ),
        );
        setLocalStream(new MediaStream(localStreamRef.current.getTracks()));
        setQosMessage("Audio processing updated and replaced in active senders.");
      } catch (audioError) {
        setQosMessage(
          audioError instanceof Error
            ? `${audioError.message} Audio controls need a real microphone; demo stream keeps running.`
            : "Audio processing update failed.",
        );
      }
    },
    [],
  );

  const setCodecPreference = useCallback(
    (preferredVideoCodec: QosControlState["codec"]["preferredVideoCodec"]) => {
      const next = {
        ...qosRef.current,
        codec: { preferredVideoCodec, requiresRestart: Boolean(preferredVideoCodec) },
      };
      qosRef.current = next;
      setQos(next);
      setQosMessage(
        preferredVideoCodec
          ? `${preferredVideoCodec} codec preference is staged. Rejoin the room to apply it.`
          : "Codec preference cleared. Rejoin the room to return to browser default.",
      );
    },
    [],
  );

  const toggleAudio = useCallback(() => {
    for (const track of localStreamRef.current?.getAudioTracks() ?? []) {
      track.enabled = !track.enabled;
    }
    setLocalStream(
      localStreamRef.current
        ? new MediaStream(localStreamRef.current.getTracks())
        : null,
    );
  }, []);

  const toggleVideo = useCallback(() => {
    for (const track of localStreamRef.current?.getVideoTracks() ?? []) {
      track.enabled = !track.enabled;
    }
    setLocalStream(
      localStreamRef.current
        ? new MediaStream(localStreamRef.current.getTracks())
        : null,
    );
  }, []);

  const roomStats: RoomStatsSnapshot = useMemo(
    () =>
      aggregateRoomStats(
        localStream ? 1 + remotePeers.length : 0,
        sessions.flatMap((session) => (session.stats ? [session.stats] : [])),
      ),
    [localStream, remotePeers.length, sessions],
  );

  return {
    localPeer,
    roomId,
    localStream,
    localMediaMode,
    mediaNotice,
    status,
    error,
    maxPeers,
    remotePeers,
    sessions,
    qos,
    qosMessage,
    devicePicker,
    deviceSelection,
    roomStats,
    setRoomId,
    setDisplayName: (displayName: string) =>
      persistLocalPeer({ ...localPeer, displayName }),
    setDeviceSelection,
    joinRoom,
    leaveRoom,
    openDevicePicker,
    closeDevicePicker,
    applySelectedDevices,
    toggleAudio,
    toggleVideo,
    updateVideoQos,
    updateAudioQos,
    setCodecPreference,
  };
};
