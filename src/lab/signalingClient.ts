import type {
  PeerInfo,
  SignalPayload,
  SignalingErrorMessage,
  SignalingServerMessage,
} from "./types";

type SignalingClientOptions = {
  url: string;
  roomId: string;
  peerId: string;
  displayName: string;
  onRoom: (message: Extract<SignalingServerMessage, { type: "room" }>) => void;
  onPeerJoined: (peer: PeerInfo) => void;
  onPeerLeft: (peerId: string) => void;
  onSignal: (from: string, payload: SignalPayload) => void;
  onError: (message: SignalingErrorMessage) => void;
  onStatus: (status: "connecting" | "open" | "closed") => void;
};

export type SignalingClient = {
  sendSignal: (to: string, payload: SignalPayload) => void;
  leave: () => void;
  close: () => void;
};

export const defaultSignalingUrl = () => {
  const meta = import.meta as ImportMeta & {
    env?: { VITE_SIGNALING_URL?: string };
  };
  return meta.env?.VITE_SIGNALING_URL ?? "ws://localhost:8787";
};

export const createSignalingClient = ({
  url,
  roomId,
  peerId,
  displayName,
  onRoom,
  onPeerJoined,
  onPeerLeft,
  onSignal,
  onError,
  onStatus,
}: SignalingClientOptions): SignalingClient => {
  const socket = new WebSocket(url);

  onStatus("connecting");

  const sendJson = (message: unknown) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  };

  socket.addEventListener("open", () => {
    onStatus("open");
    sendJson({ type: "join", roomId, peerId, displayName });
  });

  socket.addEventListener("message", (event) => {
    let message: SignalingServerMessage;
    try {
      message = JSON.parse(String(event.data)) as SignalingServerMessage;
    } catch {
      onError({
        type: "error",
        code: "invalid-message",
        message: "Signaling server sent malformed JSON.",
      });
      return;
    }

    if (message.type === "room") onRoom(message);
    if (message.type === "peer-joined") onPeerJoined(message.peer);
    if (message.type === "peer-left") onPeerLeft(message.peerId);
    if (message.type === "signal") onSignal(message.from, message.payload);
    if (message.type === "error") onError(message);
  });

  socket.addEventListener("close", () => onStatus("closed"));
  socket.addEventListener("error", () =>
    onError({
      type: "error",
      code: "invalid-message",
      message: `Cannot connect to signaling server at ${url}.`,
    }),
  );

  return {
    sendSignal: (to, payload) =>
      sendJson({ type: "signal", roomId, from: peerId, to, payload }),
    leave: () => sendJson({ type: "leave", roomId, peerId }),
    close: () => socket.close(),
  };
};
