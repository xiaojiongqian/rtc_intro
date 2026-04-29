import { Camera, LogIn, LogOut, Mic, MicOff, Video, VideoOff } from "lucide-react";
import { enabledTrackCount } from "./format";
import type { LabConnectionStatus } from "./types";

type RoomBarProps = {
  roomId: string;
  displayName: string;
  signalingUrl: string;
  status: LabConnectionStatus;
  peerCount: number;
  maxPeers: number;
  localStream: MediaStream | null;
  mediaMode: string;
  onRoomChange: (value: string) => void;
  onDisplayNameChange: (value: string) => void;
  onSignalingUrlChange: (value: string) => void;
  onJoin: () => void;
  onLeave: () => void;
  onRequestDevices: () => void;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
};

export function RoomBar({
  roomId,
  displayName,
  signalingUrl,
  status,
  peerCount,
  maxPeers,
  localStream,
  mediaMode,
  onRoomChange,
  onDisplayNameChange,
  onSignalingUrlChange,
  onJoin,
  onLeave,
  onRequestDevices,
  onToggleAudio,
  onToggleVideo,
}: RoomBarProps) {
  const joined = status === "joined";
  const busy = status === "media" || status === "signaling" || status === "leaving";
  const audioOn = enabledTrackCount(localStream, "audio") > 0;
  const videoOn = enabledTrackCount(localStream, "video") > 0;

  return (
    <header className="lab-room-bar">
      <div className="lab-brand">
        <span>WebRTC Lab</span>
        <strong>P2P Mesh 教学实验台</strong>
      </div>

      <label>
        <span>房间</span>
        <input
          disabled={joined}
          onChange={(event) => onRoomChange(event.target.value)}
          value={roomId}
        />
      </label>

      <label>
        <span>名称</span>
        <input
          disabled={joined}
          onChange={(event) => onDisplayNameChange(event.target.value)}
          value={displayName}
        />
      </label>

      <label className="lab-signaling-field">
        <span>信令服务器</span>
        <input
          disabled={joined}
          onChange={(event) => onSignalingUrlChange(event.target.value)}
          placeholder="ws://localhost:8787 或 wss://signal.example.com"
          value={signalingUrl}
        />
      </label>

      <div className="lab-room-meter">
        <span>{status}</span>
        <strong>{peerCount} / {maxPeers}</strong>
        <em>{mediaMode}</em>
      </div>

      <div className="lab-room-actions">
        <button
          className="lab-command secondary"
          disabled={busy}
          onClick={onRequestDevices}
          type="button"
        >
          <Camera size={18} />
          打开设备
        </button>
        <button
          className="icon-button"
          disabled={!joined}
          onClick={onToggleAudio}
          type="button"
          title="Toggle microphone"
        >
          {audioOn ? <Mic size={18} /> : <MicOff size={18} />}
        </button>
        <button
          className="icon-button"
          disabled={!joined}
          onClick={onToggleVideo}
          type="button"
          title="Toggle camera"
        >
          {videoOn ? <Video size={18} /> : <VideoOff size={18} />}
        </button>
        {joined ? (
          <button className="lab-command warning" onClick={onLeave} type="button">
            <LogOut size={18} />
            离开
          </button>
        ) : (
          <button className="lab-command" onClick={onJoin} type="button">
            <LogIn size={18} />
            加入
          </button>
        )}
      </div>
    </header>
  );
}
