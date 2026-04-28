import { GripHorizontal } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { VideoTile } from "./VideoTile";
import type { PeerInfo, PeerSessionState } from "./types";

type VideoGridProps = {
  localPeer: PeerInfo;
  localStream: MediaStream | null;
  sessions: PeerSessionState[];
  maxPeers: number;
};

const aspectStorageKey = "rtc-lab-video-aspect";
const minAspect = 1.15;
const maxAspect = 2.35;

const clampAspect = (value: number) =>
  Math.min(maxAspect, Math.max(minAspect, value));

const getInitialAspect = () => {
  const savedValue = window.localStorage.getItem(aspectStorageKey);
  if (!savedValue) return 16 / 9;

  const saved = Number(savedValue);
  return Number.isFinite(saved) ? clampAspect(saved) : 16 / 9;
};

const aspectLabelFor = (aspect: number) => {
  if (aspect < 1.32) return "4:3";
  if (aspect < 1.58) return "3:2";
  if (aspect < 1.95) return "16:9";
  return "21:9";
};

export function VideoGrid({
  localPeer,
  localStream,
  sessions,
  maxPeers,
}: VideoGridProps) {
  const emptySlots = Math.max(maxPeers - 1 - sessions.length, 0);
  const [aspect, setAspect] = useState(getInitialAspect);
  const dragStartRef = useRef<{ y: number; aspect: number } | null>(null);

  useEffect(() => {
    window.localStorage.setItem(aspectStorageKey, aspect.toFixed(3));
  }, [aspect]);

  const gridStyle = useMemo(
    () =>
      ({
        "--lab-video-aspect": aspect.toFixed(3),
      }) as CSSProperties,
    [aspect],
  );

  const updateAspect = useCallback((next: number) => {
    setAspect(clampAspect(next));
  }, []);

  const moveTo = useCallback((clientY: number) => {
    const start = dragStartRef.current;
    if (!start) return;
    updateAspect(start.aspect - (clientY - start.y) / 260);
  }, [updateAspect]);

  const handlePointerMove = useCallback((event: PointerEvent) => {
    moveTo(event.clientY);
  }, [moveTo]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    moveTo(event.clientY);
  }, [moveTo]);

  const stopDragging = useCallback(() => {
    dragStartRef.current = null;
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("pointerup", stopDragging);
    window.removeEventListener("mouseup", stopDragging);
    window.removeEventListener("pointercancel", stopDragging);
  }, [handleMouseMove, handlePointerMove]);

  const startDragging = useCallback((
    event:
      | ReactMouseEvent<HTMLButtonElement>
      | ReactPointerEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    dragStartRef.current = { y: event.clientY, aspect };
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("pointerup", stopDragging);
    window.addEventListener("mouseup", stopDragging);
    window.addEventListener("pointercancel", stopDragging);
  }, [aspect, handleMouseMove, handlePointerMove, stopDragging]);

  useEffect(
    () => () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("pointerup", stopDragging);
      window.removeEventListener("mouseup", stopDragging);
      window.removeEventListener("pointercancel", stopDragging);
    },
    [handleMouseMove, handlePointerMove, stopDragging],
  );

  const handleAspectKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      updateAspect(aspect + 0.06);
    }
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      updateAspect(aspect - 0.06);
    }
  };

  return (
    <section className="lab-video-wall" aria-label="P2P video mesh">
      <div className="lab-video-grid" style={gridStyle}>
        <VideoTile
          isLocal
          label={`${localPeer.displayName} (本地)`}
          stream={localStream}
        />
        {sessions.map((session) => (
          <VideoTile
            key={session.peer.peerId}
            label={session.peer.displayName}
            peer={session.peer}
            state={session.connectionState}
            stats={session.stats}
            stream={session.remoteStream}
          />
        ))}
        {Array.from({ length: emptySlots }, (_, index) => (
          <VideoTile
            key={`empty-${index}`}
            label={`空位 ${index + sessions.length + 2}`}
            stream={null}
          />
        ))}
      </div>
      <button
        aria-label="调整视频画幅"
        aria-valuemax={Math.round(maxAspect * 100)}
        aria-valuemin={Math.round(minAspect * 100)}
        aria-valuenow={Math.round(aspect * 100)}
        className="lab-video-aspect-handle"
        onKeyDown={handleAspectKey}
        onMouseDown={startDragging}
        onPointerDown={startDragging}
        role="slider"
        title="拖动调整视频画幅"
        type="button"
      >
        <GripHorizontal size={17} />
        <span>{aspectLabelFor(aspect)}</span>
      </button>
    </section>
  );
}
