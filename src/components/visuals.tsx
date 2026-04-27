import { Activity, Clock3, RadioTower, Route, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import type {
  CourseRhythmData,
  JitterSyncData,
  LatencyBudgetData,
  LearningMapData,
  QosQoeMatrixData,
  RtcScopeData,
  SignalChainData,
} from "../types";

const toneClass = (tone: string) => `tone-${tone}`;

export function LearningMap({ data }: { data: LearningMapData }) {
  return (
    <div className="learning-map">
      <div className="signal-orbit" aria-hidden="true">
        <RadioTower size={54} strokeWidth={1.4} />
        <span />
        <span />
        <span />
      </div>
      <div className="anchor-grid">
        {data.anchors.map((anchor) => (
          <div className={`anchor-card ${toneClass(anchor.tone)}`} key={anchor.label}>
            <strong>{anchor.label}</strong>
            <span>{anchor.detail}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CourseRhythm({ data }: { data: CourseRhythmData }) {
  const total = data.phases.reduce((sum, phase) => sum + phase.minutes, 0);

  return (
    <div className="course-rhythm">
      <div className="rhythm-track">
        {data.phases.map((phase) => (
          <div
            className={`rhythm-segment ${toneClass(phase.tone)}`}
            key={phase.label}
            style={{ flexGrow: phase.minutes }}
          >
            <strong>{phase.label}</strong>
            <span>{phase.minutes} min</span>
          </div>
        ))}
      </div>
      <div className="rhythm-list">
        {data.phases.map((phase) => (
          <div key={phase.label}>
            <span>{phase.label}</span>
            <p>{phase.focus}</p>
          </div>
        ))}
      </div>
      <div className="rhythm-total">
        <Clock3 size={22} strokeWidth={1.6} />
        <span>{total} min</span>
      </div>
    </div>
  );
}

export function RtcScope({ data }: { data: RtcScopeData }) {
  const [activeIndex, setActiveIndex] = useState(
    Math.max(
      data.modes.findIndex((mode) => mode.active),
      0,
    ),
  );
  const active = data.modes[activeIndex];

  return (
    <div className="rtc-scope">
      <div className="mode-tabs" role="tablist" aria-label="Media modes">
        {data.modes.map((mode, index) => (
          <button
            className={index === activeIndex ? "active" : ""}
            key={mode.label}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            onClick={() => setActiveIndex(index)}
          >
            {mode.label}
          </button>
        ))}
      </div>

      <div className="scope-diagram">
        <div className="endpoint endpoint-left">A</div>
        <div className={`flow-line ${active.label.toLowerCase()}`}>
          <span />
          <span />
        </div>
        <div className="endpoint endpoint-right">{active.label === "VOD" ? "库" : "B"}</div>
      </div>

      <div className="scope-details">
        <dl>
          <div>
            <dt>时延</dt>
            <dd>{active.latency}</dd>
          </div>
          <div>
            <dt>流向</dt>
            <dd>{active.flow}</dd>
          </div>
          <div>
            <dt>适配</dt>
            <dd>{active.fit}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export function SignalChain({ data }: { data: SignalChainData }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = data.nodes[activeIndex];

  return (
    <div className="signal-chain">
      <div className="chain-nodes">
        {data.nodes.map((node, index) => (
          <button
            className={index === activeIndex ? "active" : ""}
            key={node.label}
            type="button"
            onClick={() => setActiveIndex(index)}
          >
            <span className="node-pulse" />
            <strong>{node.label}</strong>
          </button>
        ))}
      </div>

      <div className="chain-inspector">
        <div className="inspector-title">
          <Route size={26} strokeWidth={1.6} />
          <strong>{active.label}</strong>
        </div>
        <p>{active.detail}</p>
        <div className="inspector-metrics">
          <span>{active.latency}</span>
          <span>{active.risk}</span>
        </div>
      </div>
    </div>
  );
}

export function LatencyBudget({ data }: { data: LatencyBudgetData }) {
  const [pressure, setPressure] = useState(42);
  const segments = useMemo(
    () =>
      data.segments.map((segment) => {
        const factor = pressure / 100;
        const value = Math.round(segment.min + (segment.max - segment.min) * factor);
        return {
          ...segment,
          value: Math.max(segment.min, Math.round((value + segment.base) / 2)),
        };
      }),
    [data.segments, pressure],
  );
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  const max = Math.max(...segments.map((segment) => segment.value));

  return (
    <div className="latency-budget">
      <div className="budget-head">
        <div>
          <span>End-to-End</span>
          <strong>{total} ms</strong>
        </div>
        <label>
          <SlidersHorizontal size={20} strokeWidth={1.6} />
          <input
            aria-label="Network pressure"
            type="range"
            min="0"
            max="100"
            value={pressure}
            onChange={(event) => setPressure(Number(event.target.value))}
          />
        </label>
      </div>

      <div className="budget-bars">
        {segments.map((segment) => (
          <div className="budget-row" key={segment.label}>
            <span>{segment.label}</span>
            <div className="budget-bar">
              <i
                className={toneClass(segment.tone)}
                style={{ width: `${Math.max(14, (segment.value / max) * 100)}%` }}
              />
            </div>
            <strong>{segment.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export function JitterSync({ data }: { data: JitterSyncData }) {
  const [mode, setMode] = useState<"jitter" | "sync">("jitter");
  const arrivalWidth = Math.max(...data.playout) + 40;

  return (
    <div className="jitter-sync">
      <div className="mode-tabs compact" role="tablist" aria-label="Timing modes">
        <button
          className={mode === "jitter" ? "active" : ""}
          type="button"
          role="tab"
          aria-selected={mode === "jitter"}
          onClick={() => setMode("jitter")}
        >
          抖动
        </button>
        <button
          className={mode === "sync" ? "active" : ""}
          type="button"
          role="tab"
          aria-selected={mode === "sync"}
          onClick={() => setMode("sync")}
        >
          同步
        </button>
      </div>

      {mode === "jitter" ? (
        <div className="timeline-board">
          <div className="timeline-row">
            <span>到达</span>
            <div className="timeline-line">
              {data.arrivals.map((value) => (
                <i
                  className="arrival-dot"
                  key={`arrival-${value}`}
                  style={{ left: `${(value / arrivalWidth) * 100}%` }}
                />
              ))}
            </div>
          </div>
          <div className="timeline-row">
            <span>播放</span>
            <div className="timeline-line stable">
              {data.playout.map((value) => (
                <i
                  className="playout-dot"
                  key={`playout-${value}`}
                  style={{ left: `${(value / arrivalWidth) * 100}%` }}
                />
              ))}
            </div>
          </div>
          <p className="timing-caption">播放缓冲把不稳定到达转换成稳定节奏。</p>
        </div>
      ) : (
        <div className="sync-board">
          {data.syncPairs.map((pair, index) => {
            const drift = pair.video - pair.audio;
            return (
              <div className="sync-pair" key={`${pair.audio}-${pair.video}`}>
                <span>Pair {index + 1}</span>
                <div className="sync-line">
                  <i className="audio" style={{ left: `${pair.audio / 3.2}%` }} />
                  <i className="video" style={{ left: `${pair.video / 3.2}%` }} />
                </div>
                <strong>{drift > 0 ? "+" : ""}{drift} ms</strong>
              </div>
            );
          })}
          <p className="timing-caption">音频和视频的感知时间差，决定口型是否自然。</p>
        </div>
      )}
    </div>
  );
}

export function QosQoeMatrix({ data }: { data: QosQoeMatrixData }) {
  const [focus, setFocus] = useState<"qos" | "qoe">("qoe");

  return (
    <div className="qos-qoe">
      <div className="mode-tabs compact" role="tablist" aria-label="Quality focus">
        <button
          className={focus === "qos" ? "active" : ""}
          type="button"
          role="tab"
          aria-selected={focus === "qos"}
          onClick={() => setFocus("qos")}
        >
          QoS
        </button>
        <button
          className={focus === "qoe" ? "active" : ""}
          type="button"
          role="tab"
          aria-selected={focus === "qoe"}
          onClick={() => setFocus("qoe")}
        >
          QoE
        </button>
      </div>

      <div className={`matrix-grid focus-${focus}`}>
        {data.rows.map((row) => (
          <div className="matrix-row" key={row.metric}>
            <div className="metric-chip">
              <Activity size={18} strokeWidth={1.6} />
              {row.metric}
            </div>
            <p>{focus === "qos" ? row.qos : row.qoe}</p>
            <span>{row.tradeoff}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
