import { ArrowLeft, FlaskConical } from "lucide-react";
import { useState } from "react";
import { MechanismPanel } from "./MechanismPanel";
import { QosPanel } from "./QosPanel";
import { RoomBar } from "./RoomBar";
import { StatsPanel } from "./StatsPanel";
import { VideoGrid } from "./VideoGrid";
import { useMeshRoom } from "./meshRoom";
import { defaultSignalingUrl } from "./signalingClient";

type PanelTab = "stats" | "qos" | "mechanism";

const tabs: Array<{ id: PanelTab; label: string }> = [
  { id: "stats", label: "Stats" },
  { id: "qos", label: "QoS" },
  { id: "mechanism", label: "Mechanism" },
];

export function LabShell() {
  const room = useMeshRoom();
  const [roomCode, setRoomCode] = useState(room.roomId);
  const [displayName, setDisplayName] = useState(room.localPeer.displayName);
  const [signalingUrl, setSignalingUrl] = useState(() => defaultSignalingUrl());
  const [activeTab, setActiveTab] = useState<PanelTab>("stats");

  const join = () => {
    void room.joinRoom(roomCode, displayName, signalingUrl);
  };

  return (
    <main className="lab-shell">
      <RoomBar
        displayName={displayName}
        localStream={room.localStream}
        maxPeers={room.maxPeers}
        mediaMode={room.localMediaMode}
        onDisplayNameChange={(value) => {
          setDisplayName(value);
          room.setDisplayName(value);
        }}
        onJoin={join}
        onLeave={room.leaveRoom}
        onRequestDevices={room.requestRealMedia}
        onRoomChange={(value) => {
          setRoomCode(value);
          room.setRoomId(value);
        }}
        onSignalingUrlChange={setSignalingUrl}
        onToggleAudio={room.toggleAudio}
        onToggleVideo={room.toggleVideo}
        peerCount={room.localStream ? 1 + room.remotePeers.length : 0}
        roomId={roomCode}
        signalingUrl={signalingUrl}
        status={room.status}
      />

      <section className="lab-workspace">
        <div className="lab-main">
          <div className="lab-navline">
            <a href="#/slide/1">
              <ArrowLeft size={17} />
              返回课程
            </a>
            <span>
              <FlaskConical size={17} />
              真实 P2P 媒体 + 教学化 QoS 观察
            </span>
          </div>

          {room.error ? <div className="lab-error">{room.error}</div> : null}
          {room.mediaNotice ? <div className="lab-notice">{room.mediaNotice}</div> : null}

          <VideoGrid
            localPeer={room.localPeer}
            localStream={room.localStream}
            maxPeers={room.maxPeers}
            sessions={room.sessions}
          />
        </div>

        <aside className="lab-side-panel">
          <div className="lab-tabs" role="tablist" aria-label="Lab panels">
            {tabs.map((tab) => (
              <button
                aria-selected={activeTab === tab.id}
                className={activeTab === tab.id ? "active" : ""}
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "stats" ? (
            <StatsPanel roomStats={room.roomStats} sessions={room.sessions} />
          ) : null}
          {activeTab === "qos" ? (
            <QosPanel
              message={room.qosMessage}
              onAudioChange={room.updateAudioQos}
              onCodecChange={room.setCodecPreference}
              onVideoChange={room.updateVideoQos}
              qos={room.qos}
            />
          ) : null}
          {activeTab === "mechanism" ? (
            <MechanismPanel sessions={room.sessions} />
          ) : null}
        </aside>
      </section>
    </main>
  );
}
