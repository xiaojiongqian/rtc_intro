import { createServer } from "node:http";
import { WebSocketServer } from "ws";

const PORT = Number(process.env.PORT ?? process.env.SIGNALING_PORT ?? 8787);
const MAX_PEERS = 4;

/** @type {Map<string, Map<string, { peerId: string; displayName: string; joinedAt: number; socket: import("ws").WebSocket }>>} */
const rooms = new Map();

const send = (socket, message) => {
  if (socket.readyState === socket.OPEN) {
    socket.send(JSON.stringify(message));
  }
};

const roomPeers = (room) =>
  [...room.values()].map(({ peerId, displayName, joinedAt }) => ({
    peerId,
    displayName,
    joinedAt,
  }));

const leaveRoom = (socket) => {
  const roomId = socket.roomId;
  const peerId = socket.peerId;
  if (!roomId || !peerId) return;

  const room = rooms.get(roomId);
  if (!room) return;

  room.delete(peerId);
  for (const peer of room.values()) {
    send(peer.socket, { type: "peer-left", peerId });
  }

  if (room.size === 0) {
    rooms.delete(roomId);
  }

  socket.roomId = undefined;
  socket.peerId = undefined;
};

const replaceDuplicatePeer = (room, peerId, socket) => {
  const existing = room.get(peerId);
  if (!existing || existing.socket === socket) return;

  room.delete(peerId);
  existing.socket.roomId = undefined;
  existing.socket.peerId = undefined;
  existing.socket.close(4000, "duplicate peer id");

  for (const peer of room.values()) {
    send(peer.socket, { type: "peer-left", peerId });
  }
};

const handleJoin = (socket, message) => {
  const roomId = String(message.roomId ?? "").trim();
  const peerId = String(message.peerId ?? "").trim();
  const displayName = String(message.displayName ?? "Peer").trim().slice(0, 32);

  if (!roomId || !peerId) {
    send(socket, {
      type: "error",
      code: "invalid-message",
      message: "roomId and peerId are required.",
    });
    return;
  }

  leaveRoom(socket);

  const room = rooms.get(roomId) ?? new Map();
  rooms.set(roomId, room);

  replaceDuplicatePeer(room, peerId, socket);

  if (room.size >= MAX_PEERS) {
    send(socket, {
      type: "error",
      code: "room-full",
      message: `Room ${roomId} is full. The lab supports up to ${MAX_PEERS} peers.`,
    });
    return;
  }

  const joinedAt = Date.now();
  socket.roomId = roomId;
  socket.peerId = peerId;

  const existingPeers = roomPeers(room).filter((peer) => peer.peerId !== peerId);
  const peer = { peerId, displayName: displayName || "Peer", joinedAt, socket };
  room.set(peerId, peer);

  send(socket, {
    type: "room",
    roomId,
    peerId,
    maxPeers: MAX_PEERS,
    peers: existingPeers,
  });

  for (const other of room.values()) {
    if (other.peerId !== peerId) {
      send(other.socket, {
        type: "peer-joined",
        peer: { peerId, displayName: peer.displayName, joinedAt },
      });
    }
  }
};

const handleSignal = (socket, message) => {
  const roomId = socket.roomId ?? String(message.roomId ?? "");
  const from = socket.peerId ?? String(message.from ?? "");
  const to = String(message.to ?? "");
  const room = rooms.get(roomId);
  const target = room?.get(to);

  if (!room || !from || !target) {
    send(socket, {
      type: "error",
      code: "peer-not-found",
      message: `Peer ${to || "(missing)"} is not in this room.`,
    });
    return;
  }

  send(target.socket, {
    type: "signal",
    from,
    payload: message.payload,
  });
};

const httpServer = createServer((request, response) => {
  if (request.url === "/health") {
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify({ ok: true, rooms: rooms.size }));
    return;
  }

  response.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
  response.end("WebRTC lab signaling server is running.\n");
});

const server = new WebSocketServer({ server: httpServer });

server.on("connection", (socket) => {
  socket.on("message", (raw) => {
    let message;
    try {
      message = JSON.parse(String(raw));
    } catch {
      send(socket, {
        type: "error",
        code: "invalid-message",
        message: "Messages must be JSON.",
      });
      return;
    }

    if (message.type === "join") {
      handleJoin(socket, message);
      return;
    }

    if (message.type === "signal") {
      handleSignal(socket, message);
      return;
    }

    if (message.type === "leave") {
      leaveRoom(socket);
      return;
    }

    send(socket, {
      type: "error",
      code: "invalid-message",
      message: `Unknown message type: ${message.type ?? "(missing)"}.`,
    });
  });

  socket.on("close", () => leaveRoom(socket));
  socket.on("error", () => leaveRoom(socket));
});

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`WebRTC lab signaling server listening on port ${PORT}`);
});
