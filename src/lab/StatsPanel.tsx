import { Activity, Gauge, Network, Radio } from "lucide-react";
import { formatNumber, formatPercent } from "./format";
import type { PeerSessionState, RoomStatsSnapshot } from "./types";

type StatsPanelProps = {
  roomStats: RoomStatsSnapshot;
  sessions: PeerSessionState[];
};

export function StatsPanel({ roomStats, sessions }: StatsPanelProps) {
  return (
    <section className="lab-panel-section">
      <div className="lab-metric-grid">
        <article>
          <Network size={18} />
          <span>本端连接</span>
          <strong>{roomStats.activeConnections}</strong>
          <em>全房间理论 {roomStats.theoreticalConnections}</em>
        </article>
        <article>
          <Radio size={18} />
          <span>总上行</span>
          <strong>{formatNumber(roomStats.totalOutgoingKbps, 0, " kbps")}</strong>
          <em>所有 outbound sender</em>
        </article>
        <article>
          <Gauge size={18} />
          <span>最差 RTT</span>
          <strong>{formatNumber(roomStats.worstRttMs, 0, " ms")}</strong>
          <em>candidate pair / remote RTP</em>
        </article>
        <article>
          <Activity size={18} />
          <span>最差丢包</span>
          <strong>{formatPercent(roomStats.worstLossRate)}</strong>
          <em>packetsLost / total</em>
        </article>
      </div>

      <div className="lab-peer-stats">
        {sessions.length === 0 ? (
          <p className="lab-muted-copy">加入同一房间的第二个标签页后，这里会显示每条 P2P 连接的实时 stats。</p>
        ) : null}
        {sessions.map((session) => (
          <article key={session.peer.peerId}>
            <header>
              <strong>{session.peer.displayName}</strong>
              <span>{session.connectionState} / {session.iceConnectionState}</span>
            </header>
            <dl>
              <div>
                <dt>RTT</dt>
                <dd>{formatNumber(session.stats?.connection.currentRoundTripTimeMs, 0, "ms")}</dd>
              </div>
              <div>
                <dt>loss</dt>
                <dd>{formatPercent(session.stats?.inbound.packetLossRate)}</dd>
              </div>
              <div>
                <dt>jitter</dt>
                <dd>{formatNumber(session.stats?.inbound.jitterMs, 1, "ms")}</dd>
              </div>
              <div>
                <dt>JBD</dt>
                <dd>{formatNumber(session.stats?.inbound.jitterBufferDelayMs, 1, "ms")}</dd>
              </div>
              <div>
                <dt>out</dt>
                <dd>{formatNumber(session.stats?.outbound.videoBitrateKbps, 0, "k")}</dd>
              </div>
              <div>
                <dt>in</dt>
                <dd>{formatNumber(session.stats?.inbound.videoBitrateKbps, 0, "k")}</dd>
              </div>
              <div>
                <dt>NACK</dt>
                <dd>{formatNumber(session.stats?.outbound.nackCount, 0)}</dd>
              </div>
              <div>
                <dt>PLI/FIR</dt>
                <dd>
                  {formatNumber(session.stats?.outbound.pliCount, 0)} / {formatNumber(session.stats?.outbound.firCount, 0)}
                </dd>
              </div>
              <div>
                <dt>codec</dt>
                <dd>{session.stats?.inbound.codec ?? session.stats?.outbound.codec ?? "N/A"}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
