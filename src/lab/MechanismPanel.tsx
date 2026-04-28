import { BadgeAlert, Eye, ShieldCheck, Waves } from "lucide-react";
import { formatNumber, formatPercent } from "./format";
import type { PeerSessionState } from "./types";

type MechanismPanelProps = {
  sessions: PeerSessionState[];
};

export function MechanismPanel({ sessions }: MechanismPanelProps) {
  const nackCount = sessions.reduce(
    (total, session) => total + (session.stats?.outbound.nackCount ?? 0),
    0,
  );
  const concealment = sessions
    .map((session) => session.stats?.inbound.concealmentRate)
    .find((value) => typeof value === "number");
  const jitterBuffer = sessions
    .map((session) => session.stats?.inbound.jitterBufferDelayMs)
    .find((value) => typeof value === "number");

  return (
    <section className="lab-panel-section">
      <div className="lab-mechanism-list">
        <article>
          <Eye size={20} />
          <strong>NACK / RTX</strong>
          <span>观察项，不是应用层开关</span>
          <p>当前 NACK 累计：{formatNumber(nackCount, 0)}。是否补得回来，要同时看 RTT 和播放 deadline。</p>
        </article>
        <article>
          <ShieldCheck size={20} />
          <strong>FEC / RED</strong>
          <span>用带宽换时间</span>
          <p>浏览器实现差异较大，本实验台用冗余成本解释，不承诺强制启用。</p>
        </article>
        <article>
          <Waves size={20} />
          <strong>PLC</strong>
          <span>接收端体验兜底</span>
          <p>concealment：{formatPercent(concealment)}。它让播放连续，但没有恢复真实网络包。</p>
        </article>
        <article>
          <BadgeAlert size={20} />
          <strong>Jitter buffer</strong>
          <span>稳定和时延的交换</span>
          <p>JBD：{formatNumber(jitterBuffer, 1, "ms")}。缓冲越深，卡顿可能少，但互动会慢。</p>
        </article>
      </div>
    </section>
  );
}
