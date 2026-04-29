import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import { useEffect, useRef } from "react";
import { enabledTrackCount, formatNumber, formatPercent } from "./format";
import type { PeerInfo, RtcStatsSnapshot } from "./types";

type VideoTileProps = {
  label: string;
  peer?: PeerInfo;
  stream: MediaStream | null;
  isLocal?: boolean;
  state?: string;
  stats?: RtcStatsSnapshot;
};

export function VideoTile({ label, peer, stream, isLocal, state, stats }: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasVideo = enabledTrackCount(stream, "video") > 0;
  const hasAudio = enabledTrackCount(stream, "audio") > 0;
  const showStats = Boolean(peer);

  useEffect(() => {
    if (videoRef.current && videoRef.current.srcObject !== stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <article className={`lab-video-tile ${isLocal ? "local" : ""} ${showStats ? "has-stats" : "no-stats"}`}>
      {stream ? (
        <video
          autoPlay
          muted={isLocal}
          playsInline
          ref={videoRef}
        />
      ) : (
        <div className="lab-empty-video">
          <span>waiting</span>
          <strong>空位</strong>
        </div>
      )}

      <div className="lab-video-shade" />

      <div className="lab-video-topline">
        <strong>{label}</strong>
        <span>{state ?? (isLocal ? "local" : "idle")}</span>
      </div>

      <div className="lab-video-media">
        {hasAudio ? <Mic size={16} /> : <MicOff size={16} />}
        {hasVideo ? <Video size={16} /> : <VideoOff size={16} />}
      </div>

      {showStats ? (
        <div className="lab-video-stats">
          <span>RTT {formatNumber(stats?.connection.currentRoundTripTimeMs, 0, "ms")}</span>
          <span>loss {formatPercent(stats?.inbound.packetLossRate)}</span>
          <span>FPS {formatNumber(stats?.inbound.framesPerSecond ?? stats?.outbound.framesPerSecond, 0)}</span>
          <span>{stats?.inbound.codec ?? stats?.outbound.codec ?? "codec N/A"}</span>
        </div>
      ) : null}
    </article>
  );
}
