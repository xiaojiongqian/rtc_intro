import {
  Activity,
  CheckCircle2,
  Clock3,
  GitBranch,
  KeyRound,
  Layers3,
  MousePointerClick,
  Network,
  RadioTower,
  Route,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type {
  ArchitectureDecisionData,
  AudioProcessingData,
  CodecOverviewData,
  CodecTradeoffData,
  ConnectionTroubleshootingData,
  CourseRhythmData,
  HybridArchitectureData,
  IcePathData,
  InteractionCommand,
  JitterSyncData,
  LatencyBudgetData,
  LayeredEncodingData,
  LearningMapData,
  MediaTopologyComparisonData,
  MeshArchitectureData,
  OfferAnswerData,
  ProtocolFlowData,
  ProtocolStackData,
  QosQoeMatrixData,
  RtcScopeData,
  ScenarioMapData,
  SecureChannelData,
  SignalChainData,
  SignalingBoundaryData,
  SfuArchitectureData,
  StudentPromptData,
  VideoParametersData,
} from "../types";

const toneClass = (tone: string) => `tone-${tone}`;
const wrap = (value: number, length: number) => (value + length) % length;

type InteractiveVisualProps<TData> = {
  data: TData;
  interactionCommand: InteractionCommand;
};

export function LearningMap({
  data,
  interactionCommand,
}: InteractiveVisualProps<LearningMapData>) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (interactionCommand.tick === 0) return;
    setActiveIndex((value) => wrap(value + interactionCommand.direction, data.anchors.length));
  }, [data.anchors.length, interactionCommand]);

  return (
    <div className="learning-map">
      <div className="signal-orbit" aria-hidden="true">
        <RadioTower size={54} strokeWidth={1.4} />
        <span />
        <span />
        <span />
      </div>
      <div className="anchor-grid">
        {data.anchors.map((anchor, index) => (
          <div
            className={`anchor-card ${toneClass(anchor.tone)} ${index === activeIndex ? "active" : ""}`}
            key={anchor.label}
          >
            <strong>{anchor.label}</strong>
            <span>{anchor.detail}</span>
            <em>{anchor.depth}</em>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CourseRhythm({
  data,
  interactionCommand,
}: InteractiveVisualProps<CourseRhythmData>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = data.phases.reduce((sum, phase) => sum + phase.minutes, 0);

  useEffect(() => {
    if (interactionCommand.tick === 0) return;
    setActiveIndex((value) => wrap(value + interactionCommand.direction, data.phases.length));
  }, [data.phases.length, interactionCommand]);

  return (
    <div className="course-rhythm">
      <div className="rhythm-track">
        {data.phases.map((phase, index) => (
          <div
            className={`rhythm-segment ${toneClass(phase.tone)} ${index === activeIndex ? "active" : ""}`}
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
          <div className={phase === data.phases[activeIndex] ? "active" : ""} key={phase.label}>
            <span>{phase.label}</span>
            <p>{phase.focus}</p>
            <em>{phase.output}</em>
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

export function RtcScope({
  data,
  interactionCommand,
}: InteractiveVisualProps<RtcScopeData>) {
  const [activeIndex, setActiveIndex] = useState(
    Math.max(
      data.modes.findIndex((mode) => mode.active),
      0,
    ),
  );
  const active = data.modes[activeIndex];

  useEffect(() => {
    if (interactionCommand.tick === 0) return;
    setActiveIndex((value) => wrap(value + interactionCommand.direction, data.modes.length));
  }, [data.modes.length, interactionCommand]);

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
          <div>
            <dt>约束</dt>
            <dd>{active.constraint}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export function ScenarioMap({
  data,
  interactionCommand,
}: InteractiveVisualProps<ScenarioMapData>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = data.scenarios[activeIndex];

  useEffect(() => {
    if (interactionCommand.tick === 0) return;
    setActiveIndex((value) => wrap(value + interactionCommand.direction, data.scenarios.length));
  }, [data.scenarios.length, interactionCommand]);

  return (
    <div className="scenario-map">
      <div className="scenario-rail">
        {data.scenarios.map((scenario, index) => (
          <button
            className={`${toneClass(scenario.tone)} ${index === activeIndex ? "active" : ""}`}
            key={scenario.label}
            type="button"
            onClick={() => setActiveIndex(index)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{scenario.label}</strong>
          </button>
        ))}
      </div>

      <div className={`scenario-card-large ${toneClass(active.tone)}`}>
        <strong>{active.label}</strong>
        <p>{active.setting}</p>
        <dl>
          <div>
            <dt>媒体</dt>
            <dd>{active.media}</dd>
          </div>
          <div>
            <dt>约束</dt>
            <dd>{active.constraint}</dd>
          </div>
          <div>
            <dt>观测</dt>
            <dd>{active.metric}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export function StudentPrompt({
  data,
  interactionCommand,
}: InteractiveVisualProps<StudentPromptData>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const active = data.options[activeIndex];

  useEffect(() => {
    if (interactionCommand.tick === 0) return;
    if (interactionCommand.action === "activate") {
      setRevealed(true);
      return;
    }
    if (interactionCommand.direction === -1) {
      setActiveIndex((index) => wrap(index - 1, data.options.length));
    } else {
      setActiveIndex((index) => wrap(index + 1, data.options.length));
    }
    setRevealed(false);
  }, [
    data.options.length,
    interactionCommand.action,
    interactionCommand.tick,
    interactionCommand.direction,
  ]);

  return (
    <div className="student-prompt">
      <div className="prompt-question">
        <span>Question</span>
        <strong>{data.question}</strong>
        <p>{data.instruction}</p>
      </div>

      <div className="prompt-options">
        {data.options.map((option, index) => (
          <button
            className={`${toneClass(option.tone)} ${index === activeIndex ? "active" : ""}`}
            key={option.label}
            type="button"
            onClick={() => {
              setActiveIndex(index);
              setRevealed(false);
            }}
          >
            <span>{option.label}</span>
            <p>{option.answer}</p>
          </button>
        ))}
      </div>

      <div className={`prompt-reveal ${toneClass(active.tone)} ${revealed ? "open" : ""}`}>
        <div>
          <CheckCircle2 size={22} strokeWidth={1.7} />
          <strong>{revealed ? "参考讨论" : "先让学生回答"}</strong>
        </div>
        <p>{revealed ? active.rationale : "按上下方向切换选项，按 Enter 揭示当前选项的参考判断。"}</p>
      </div>
    </div>
  );
}

export function ProtocolStack({
  data,
  interactionCommand,
}: InteractiveVisualProps<ProtocolStackData>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = data.layers[activeIndex];

  useEffect(() => {
    if (interactionCommand.tick === 0) return;
    setActiveIndex((value) => wrap(value + interactionCommand.direction, data.layers.length));
  }, [data.layers.length, interactionCommand]);

  return (
    <div className="protocol-stack">
      <div className="stack-layers" aria-label="RTC protocol stack">
        {data.layers.map((layer, index) => (
          <button
            className={`${toneClass(layer.tone)} ${index === activeIndex ? "active" : ""}`}
            key={layer.label}
            type="button"
            onClick={() => setActiveIndex(index)}
          >
            <span>{layer.plane}</span>
            <strong>{layer.label}</strong>
            <em>{layer.role}</em>
          </button>
        ))}
      </div>

      <div className={`stack-inspector ${toneClass(active.tone)}`}>
        <div>
          <Layers3 size={28} strokeWidth={1.6} />
          <span>{active.plane}</span>
        </div>
        <strong>{active.label}</strong>
        <p>{active.role}</p>
        <em>{active.evidence}</em>
      </div>
    </div>
  );
}

export function ProtocolFlow({
  data,
  interactionCommand,
}: InteractiveVisualProps<ProtocolFlowData>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = data.lanes[activeIndex];

  useEffect(() => {
    if (interactionCommand.tick === 0) return;
    setActiveIndex((value) => wrap(value + interactionCommand.direction, data.lanes.length));
  }, [data.lanes.length, interactionCommand]);

  return (
    <div className="protocol-flow">
      <div className="flow-lanes">
        {data.lanes.map((lane, index) => (
          <button
            className={`protocol-lane ${toneClass(lane.tone)} ${index === activeIndex ? "active" : ""}`}
            key={lane.label}
            type="button"
            onClick={() => setActiveIndex(index)}
          >
            <div className="lane-label">
              <strong>{lane.label}</strong>
              <span>{lane.direction}</span>
            </div>
            <div className="protocol-lane-track" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <em>{lane.signal}</em>
          </button>
        ))}
      </div>

      <div className={`flow-inspector ${toneClass(active.tone)}`}>
        <strong>{active.label} 的职责边界</strong>
        <p>{active.payload}</p>
        <span>{active.evidence}</span>
      </div>
    </div>
  );
}

export function OfferAnswer({
  data,
  interactionCommand,
}: InteractiveVisualProps<OfferAnswerData>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = data.steps[activeIndex];

  useEffect(() => {
    if (interactionCommand.tick === 0) return;
    setActiveIndex((value) => wrap(value + interactionCommand.direction, data.steps.length));
  }, [data.steps.length, interactionCommand]);

  return (
    <div className="offer-answer">
      <div className="offer-track">
        {data.steps.map((step, index) => (
          <button
            className={`${toneClass(step.tone)} ${index === activeIndex ? "active" : ""}`}
            key={`${step.actor}-${step.action}`}
            type="button"
            onClick={() => setActiveIndex(index)}
          >
            <span>{index + 1}</span>
            <strong>{step.action}</strong>
            <em>{step.actor}</em>
          </button>
        ))}
      </div>

      <div className={`offer-inspector ${toneClass(active.tone)}`}>
        <div>
          <GitBranch size={26} strokeWidth={1.6} />
          <span>{active.actor}</span>
        </div>
        <strong>{active.action}</strong>
        <p>{active.detail}</p>
        <em>{active.state}</em>
      </div>
    </div>
  );
}

export function SignalingBoundary({
  data,
  interactionCommand,
}: InteractiveVisualProps<SignalingBoundaryData>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = data.zones[activeIndex];

  useEffect(() => {
    if (interactionCommand.tick === 0) return;
    setActiveIndex((value) => wrap(value + interactionCommand.direction, data.zones.length));
  }, [data.zones.length, interactionCommand]);

  return (
    <div className="signaling-boundary">
      <div className="boundary-map">
        {data.zones.map((zone, index) => (
          <button
            className={`${toneClass(zone.tone)} ${index === activeIndex ? "active" : ""}`}
            key={zone.label}
            type="button"
            onClick={() => setActiveIndex(index)}
          >
            <span>{zone.owner}</span>
            <strong>{zone.label}</strong>
          </button>
        ))}
      </div>

      <div className={`boundary-inspector ${toneClass(active.tone)}`}>
        <div>
          <Network size={26} strokeWidth={1.6} />
          <span>{active.owner}</span>
        </div>
        <strong>{active.label}</strong>
        <p>{active.examples}</p>
        <em>{active.boundary}</em>
      </div>
    </div>
  );
}

export function IcePath({
  data,
  interactionCommand,
}: InteractiveVisualProps<IcePathData>) {
  const [activeIndex, setActiveIndex] = useState(1);
  const active = data.paths[activeIndex];
  const serverLabel =
    active.diagram === "turn"
      ? "TURN Relay"
      : active.diagram === "stun"
        ? "STUN Server"
        : "Host / LAN";
  const serverRole =
    active.diagram === "turn"
      ? "转发媒体"
      : active.diagram === "stun"
        ? "只做探测"
        : "直达路径";

  useEffect(() => {
    if (interactionCommand.tick === 0) return;
    setActiveIndex((value) => wrap(value + interactionCommand.direction, data.paths.length));
  }, [data.paths.length, interactionCommand]);

  return (
    <div className="ice-path">
      <div className="candidate-paths">
        {data.paths.map((path, index) => (
          <button
            className={`${toneClass(path.tone)} ${index === activeIndex ? "active" : ""}`}
            key={path.label}
            type="button"
            onClick={() => setActiveIndex(index)}
          >
            <strong>{path.label}</strong>
            <span>{path.cost}</span>
          </button>
        ))}
      </div>

      <div className={`ice-route-map ${toneClass(active.tone)} flow-${active.diagram}`}>
        <div className="flow-summary">
          <Route size={24} strokeWidth={1.6} />
          <div>
            <strong>{active.route}</strong>
            <span>{active.risk}</span>
          </div>
        </div>
        <svg
          className="ice-flow-svg"
          role="img"
          viewBox="0 0 640 226"
          aria-label={`${active.label} media path`}
        >
          <g className="ice-peer peer-a">
            <rect x="20" y="142" width="112" height="54" rx="8" />
            <text x="76" y="164" textAnchor="middle">Peer A</text>
            <text x="76" y="184" textAnchor="middle">NAT / FW</text>
          </g>
          <g className="ice-peer peer-b">
            <rect x="508" y="142" width="112" height="54" rx="8" />
            <text x="564" y="164" textAnchor="middle">Peer B</text>
            <text x="564" y="184" textAnchor="middle">NAT / FW</text>
          </g>
          <g className="path-server">
            <rect x="250" y="26" width="140" height="58" rx="8" />
            <text x="320" y="50" textAnchor="middle">{serverLabel}</text>
            <text x="320" y="70" textAnchor="middle">{serverRole}</text>
          </g>

          {active.diagram === "turn" ? (
            <>
              <path className="media-line relay-line" d="M132 158 C210 118 248 86 284 72" />
              <path className="media-line relay-line" d="M356 72 C394 86 432 118 508 158" />
              <circle className="media-packet" cx="210" cy="118" r="6" />
              <circle className="media-packet" cx="432" cy="118" r="6" />
              <text className="flow-label" x="320" y="126" textAnchor="middle">SRTP media via relay</text>
            </>
          ) : (
            <>
              <path className="media-line direct-line" d="M132 168 C248 208 392 208 508 168" />
              <circle className="media-packet" cx="246" cy="196" r="6" />
              <circle className="media-packet" cx="394" cy="196" r="6" />
              <text className="flow-label" x="320" y="220" textAnchor="middle">SRTP media direct</text>
              {active.diagram === "stun" ? (
                <>
                  <path className="probe-line" d="M110 142 C164 86 216 62 250 58" />
                  <path className="probe-line" d="M530 142 C476 86 424 62 390 58" />
                  <text className="probe-label" x="320" y="108" textAnchor="middle">STUN checks only</text>
                </>
              ) : null}
            </>
          )}
        </svg>
        <div className="flow-caption">
          <strong>{active.mediaFlow}</strong>
          <span>{active.probeFlow}</span>
        </div>
      </div>

      <div className="ice-checks">
        {data.checks.map((check, index) => (
          <span className={index <= activeIndex + 1 ? "active" : ""} key={check}>
            {check}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ConnectionTroubleshooting({
  data,
  interactionCommand,
}: InteractiveVisualProps<ConnectionTroubleshootingData>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [exampleIndex, setExampleIndex] = useState(0);
  const active = data.stages[activeIndex];
  const activeExample = active.examples[exampleIndex % active.examples.length];

  useEffect(() => {
    if (interactionCommand.tick === 0) return;
    if (interactionCommand.action === "activate") {
      setExampleIndex((value) => wrap(value + 1, active.examples.length));
      return;
    }
    setActiveIndex((value) => wrap(value + interactionCommand.direction, data.stages.length));
    setExampleIndex(0);
  }, [
    active.examples.length,
    data.stages.length,
    interactionCommand.action,
    interactionCommand.direction,
    interactionCommand.tick,
  ]);

  return (
    <div className="connection-troubleshooting">
      <div className="trouble-incident">
        <span>Incident</span>
        <strong>{data.incident}</strong>
      </div>

      <div className="trouble-flow">
        {data.stages.map((stage, index) => (
          <button
            className={`${toneClass(stage.tone)} ${index === activeIndex ? "active" : ""}`}
            key={stage.label}
            type="button"
            onClick={() => {
              setActiveIndex(index);
              setExampleIndex(0);
            }}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{stage.label}</strong>
          </button>
        ))}
      </div>

      <div className={`trouble-detail ${toneClass(active.tone)}`}>
        <div className="trouble-evidence">
          <span>{active.label}</span>
          <strong>{active.question}</strong>
          <ul>
            {active.evidence.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <em>{active.nextAction}</em>
        </div>

        <div className="trouble-example">
          <div>
            <span>Case {exampleIndex + 1}/{active.examples.length}</span>
            <strong>{activeExample.symptom}</strong>
          </div>
          <dl>
            <div>
              <dt>证据</dt>
              <dd>{activeExample.clue}</dd>
            </div>
            <div>
              <dt>原因</dt>
              <dd>{activeExample.likelyCause}</dd>
            </div>
            <div>
              <dt>动作</dt>
              <dd>{activeExample.action}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

export function SecureChannel({
  data,
  interactionCommand,
}: InteractiveVisualProps<SecureChannelData>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = data.stages[activeIndex];
  const activeMessages = data.sequence.filter((message) => message.stage === activeIndex);
  const actors = [
    { id: "peerA", label: "Peer A" },
    { id: "signaling", label: "Signaling" },
    { id: "peerB", label: "Peer B" },
    { id: "media", label: "SRTP Media" },
  ] as const;
  const actorColumn = {
    peerA: 1,
    signaling: 2,
    peerB: 3,
    media: 4,
  };

  useEffect(() => {
    if (interactionCommand.tick === 0) return;
    setActiveIndex((value) => wrap(value + interactionCommand.direction, data.stages.length));
  }, [data.stages.length, interactionCommand]);

  return (
    <div className="secure-channel">
      <div className="secure-track">
        {data.stages.map((stage, index) => (
          <button
            className={`${toneClass(stage.tone)} ${index === activeIndex ? "active" : ""}`}
            key={stage.label}
            type="button"
            onClick={() => setActiveIndex(index)}
          >
            <span>
              {index <= 1 ? <ShieldCheck size={22} /> : <KeyRound size={22} />}
            </span>
            <strong>{stage.label}</strong>
            <em>{stage.output}</em>
          </button>
        ))}
      </div>

      <div className="secure-workspace">
        <div className={`secure-inspector ${toneClass(active.tone)}`}>
          <strong>{active.label}</strong>
          <p>{active.detail}</p>
          <span>{active.output}</span>
          <div className="secure-message-list">
            {activeMessages.map((message) => (
              <em className={toneClass(message.tone)} key={message.label}>
                {message.label}
              </em>
            ))}
          </div>
        </div>

        <div className="secure-sequence" aria-label="DTLS to SRTP sequence diagram">
          <div className="sequence-actors">
            {actors.map((actor) => (
              <span key={actor.id}>{actor.label}</span>
            ))}
          </div>
          <div className="sequence-rows">
            {data.sequence.map((message) => {
              const from = actorColumn[message.from];
              const to = actorColumn[message.to];
              const start = Math.min(from, to);
              const end = Math.max(from, to);
              const reverse = from > to;
              return (
                <div
                  className={`sequence-row ${message.stage === activeIndex ? "active" : ""}`}
                  key={`${message.label}-${message.from}-${message.to}`}
                >
                  <div
                    className={`sequence-message ${toneClass(message.tone)} ${reverse ? "reverse" : ""}`}
                    style={{ gridColumn: `${start} / ${end + 1}` }}
                  >
                    <i aria-hidden="true" />
                    <strong>{message.label}</strong>
                    <span>{message.detail}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MeshArchitecture({
  data,
  interactionCommand,
}: InteractiveVisualProps<MeshArchitectureData>) {
  const [activeIndex, setActiveIndex] = useState(1);
  const active = data.roomSizes[activeIndex];
  const participants = active.participants;
  const upstreamPerPeer = participants - 1;
  const totalMediaDirections = participants * upstreamPerPeer;
  const positions = [
    { x: 260, y: 42 },
    { x: 448, y: 104 },
    { x: 378, y: 232 },
    { x: 142, y: 232 },
    { x: 72, y: 104 },
  ].slice(0, participants);
  const links = positions.flatMap((from, fromIndex) =>
    positions.slice(fromIndex + 1).map((to, offset) => ({
      from,
      to,
      key: `${fromIndex}-${fromIndex + offset + 1}`,
    })),
  );

  useEffect(() => {
    if (interactionCommand.tick === 0) return;
    setActiveIndex((value) => wrap(value + interactionCommand.direction, data.roomSizes.length));
  }, [data.roomSizes.length, interactionCommand]);

  return (
    <div className="mesh-architecture">
      <div className="architecture-tabs">
        {data.roomSizes.map((room, index) => (
          <button
            className={`${toneClass(room.tone)} ${index === activeIndex ? "active" : ""}`}
            key={room.participants}
            type="button"
            onClick={() => setActiveIndex(index)}
          >
            <strong>{room.participants} 人</strong>
            <span>{room.fit}</span>
          </button>
        ))}
      </div>

      <div className={`mesh-board ${toneClass(active.tone)}`}>
        <svg viewBox="0 0 520 280" role="img" aria-label={`${participants} person mesh`}>
          {links.map((link) => (
            <line
              className="mesh-link"
              key={link.key}
              x1={link.from.x}
              x2={link.to.x}
              y1={link.from.y}
              y2={link.to.y}
            />
          ))}
          {positions.map((position, index) => (
            <g className="mesh-peer" key={`peer-${index}`}>
              <circle cx={position.x} cy={position.y} r="27" />
              <text x={position.x} y={position.y + 5} textAnchor="middle">
                P{index + 1}
              </text>
            </g>
          ))}
        </svg>

        <div className="architecture-metrics">
          <div>
            <span>单端上行</span>
            <strong>{upstreamPerPeer} 路</strong>
          </div>
          <div>
            <span>全房间媒体方向</span>
            <strong>{totalMediaDirections} 条</strong>
          </div>
          <div>
            <span>编码/发送压力</span>
            <strong>{active.encoding}</strong>
          </div>
        </div>

        <p>{active.pain}</p>
      </div>
    </div>
  );
}

export function SfuArchitecture({
  data,
  interactionCommand,
}: InteractiveVisualProps<SfuArchitectureData>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = data.receivers[activeIndex];

  useEffect(() => {
    if (interactionCommand.tick === 0) return;
    setActiveIndex((value) => wrap(value + interactionCommand.direction, data.receivers.length));
  }, [data.receivers.length, interactionCommand]);

  return (
    <div className="sfu-architecture">
      <div className="sfu-diagram">
        <div className="publisher-node">
          <span>Publisher</span>
          <strong>{data.uplink.label}</strong>
          <em>{data.uplink.detail}</em>
        </div>
        <div className="packet-flow packet-flow-in">
          <span>Encoded RTP/SRTP</span>
          <i aria-hidden="true" />
        </div>
        <div className="sfu-core">
          <Network size={30} strokeWidth={1.6} />
          <strong>SFU</strong>
          <span>Selective Forwarding</span>
          <em>透传包 / 不重新编解码</em>
        </div>
        <div className="sfu-downlink-column">
          {data.receivers.map((receiver, index) => (
            <div
              className={`sfu-route-row ${toneClass(receiver.tone)} ${index === activeIndex ? "active" : ""}`}
              key={receiver.label}
            >
              <div className="packet-flow packet-flow-out">
                <span>{receiver.subscription}</span>
                <i aria-hidden="true" />
              </div>
              <button
                className={`${toneClass(receiver.tone)} ${index === activeIndex ? "active" : ""}`}
                type="button"
                onClick={() => setActiveIndex(index)}
              >
                <strong>{receiver.label}</strong>
                <span>{receiver.subscription}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="sfu-layers">
        {data.layers.map((layer) => (
          <div className={`sfu-layer ${toneClass(layer.tone)}`} key={layer.label}>
            <strong>{layer.label}</strong>
            <span>{layer.bitrate}</span>
            <em>{layer.fit}</em>
          </div>
        ))}
      </div>

      <div className={`sfu-inspector ${toneClass(active.tone)}`}>
        <strong>{active.label}: {active.network}</strong>
        <p>{active.reason}</p>
      </div>
    </div>
  );
}

export function MediaTopologyComparison({
  data,
  interactionCommand,
}: InteractiveVisualProps<MediaTopologyComparisonData>) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (interactionCommand.tick === 0) return;
    setActiveIndex((value) => wrap(value + interactionCommand.direction, data.modes.length));
  }, [data.modes.length, interactionCommand]);

  return (
    <div className="media-topology-comparison">
      <div className="topology-legend">
        <span>同一媒体拓扑</span>
        <strong>多路上行 → 中心媒体服务器 → 按需下行</strong>
      </div>

      <div className="topology-rows">
        {data.modes.map((mode, index) => (
          <button
            className={`topology-row-card ${toneClass(mode.tone)} ${index === activeIndex ? "active" : ""}`}
            key={mode.label}
            type="button"
            onClick={() => setActiveIndex(index)}
          >
            <div className="topology-name">
              <span>{mode.label}</span>
              <strong>{mode.headline}</strong>
            </div>

            <div className="topology-flow">
              <div className="topology-end senders">
                <strong>Senders</strong>
                <span>A: {mode.inputLabel}</span>
                <span>B: {mode.inputLabel}</span>
                <span>C: {mode.inputLabel}</span>
              </div>
              <i className="topology-arrow" aria-hidden="true" />
              <div className="topology-server">
                <strong>{mode.server}</strong>
                {mode.serverSteps.map((step) => (
                  <em key={step}>{step}</em>
                ))}
              </div>
              <i className="topology-arrow" aria-hidden="true" />
              <div className="topology-end receivers">
                <strong>Receivers</strong>
                {mode.outputs.map((output) => (
                  <span key={output.label}>{output.label}: {output.stream}</span>
                ))}
              </div>
            </div>

            <div className="topology-summary">
              <span>{mode.summary}</span>
              <em>{mode.tradeoff}</em>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function HybridArchitecture({
  data,
  interactionCommand,
}: InteractiveVisualProps<HybridArchitectureData>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = data.modes[activeIndex];

  useEffect(() => {
    if (interactionCommand.tick === 0) return;
    setActiveIndex((value) => wrap(value + interactionCommand.direction, data.modes.length));
  }, [data.modes.length, interactionCommand]);

  return (
    <div className="hybrid-architecture">
      <div className="mode-tabs compact" role="tablist" aria-label="Architecture mode">
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

      <div className={`hybrid-path ${toneClass(active.tone)}`}>
        {active.path.map((step, index) => (
          <div className="hybrid-step" key={step}>
            <strong>{step}</strong>
            {index < active.path.length - 1 ? <span aria-hidden="true" /> : null}
          </div>
        ))}
      </div>

      <div className={`processing-strip processing-${active.processing.mode} ${toneClass(active.tone)}`}>
        <strong>{active.processing.label}</strong>
        <span>{active.processing.detail}</span>
      </div>

      <div className="hybrid-detail">
        <div className={`hybrid-use ${toneClass(active.tone)}`}>
          <span>Use case</span>
          <strong>{active.useCase}</strong>
        </div>
        <div>
          <span>优势</span>
          {active.strengths.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
        <div>
          <span>代价</span>
          {active.costs.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ArchitectureDecision({
  data,
  interactionCommand,
}: InteractiveVisualProps<ArchitectureDecisionData>) {
  const [activeOption, setActiveOption] = useState(1);
  const [activeCriterion, setActiveCriterion] = useState(0);
  const option = data.options[activeOption];
  const criterion = data.criteria[activeCriterion];
  const lensNote = option.lensNotes[activeCriterion] ?? option.rationale;

  useEffect(() => {
    if (interactionCommand.tick === 0) return;
    if (interactionCommand.action === "activate") {
      setActiveCriterion((value) => wrap(value + 1, data.criteria.length));
      return;
    }
    setActiveOption((value) => wrap(value + interactionCommand.direction, data.options.length));
  }, [
    data.criteria.length,
    data.options.length,
    interactionCommand.action,
    interactionCommand.direction,
    interactionCommand.tick,
  ]);

  return (
    <div className="architecture-decision">
      <div className="decision-scenario">
        <span>课堂案例</span>
        <strong>{data.scenario}</strong>
      </div>

      <div className="decision-board">
        <div className={`decision-question ${toneClass(option.tone)}`}>
          <span>
            启发问题 {activeCriterion + 1}/{data.criteria.length} · {criterion.label}
          </span>
          <strong>{criterion.question}</strong>
          <p>{criterion.facilitatorPrompt}</p>
        </div>

        <div className="decision-grid">
          {data.options.map((candidate, optionIndex) => (
            <button
              aria-pressed={optionIndex === activeOption}
              className={`${toneClass(candidate.tone)} ${optionIndex === activeOption ? "active" : ""}`}
              key={candidate.label}
              type="button"
              onClick={() => setActiveOption(optionIndex)}
            >
              <strong>{candidate.label}</strong>
              <span>{candidate.fit}</span>
              <em>
                {data.criteria[activeCriterion].label} {candidate.scores[activeCriterion]}/5
              </em>
              <div className="score-bars" aria-hidden="true">
                <i className="focus" style={{ width: `${candidate.scores[activeCriterion] * 20}%` }} />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className={`decision-inspector ${toneClass(option.tone)}`}>
        <div className="decision-inspector-head">
          <div>
            <strong>{option.label}</strong>
            <span>{option.fit}</span>
          </div>
          <em>{criterion.label}: {criterion.question}</em>
        </div>
        <p className="decision-lens">{lensNote}</p>
        <div className="decision-columns">
          <section>
            <span>优势</span>
            <ul>
              {option.strengths.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section>
            <span>短板</span>
            <ul>
              {option.weaknesses.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section>
            <span>适用场景</span>
            <p>{option.bestFor}</p>
            <em>{option.avoidWhen}</em>
          </section>
        </div>
      </div>
    </div>
  );
}

export function CodecOverview({
  data,
  interactionCommand: _interactionCommand,
}: InteractiveVisualProps<CodecOverviewData>) {
  const defaultCodecLabel = data.scenarios[0]?.preferredCodecs[0] ?? data.codecs[0]?.label ?? "";
  const [selection, setSelection] = useState({
    codecLabel: defaultCodecLabel,
    scenarioIndex: 0,
  });
  const activeScenario = data.scenarios[selection.scenarioIndex] ?? data.scenarios[0];
  const activeCodec =
    data.codecs.find((codec) => codec.label === selection.codecLabel) ?? data.codecs[0];
  const preferredSet = new Set(activeScenario.preferredCodecs);
  const codecGroups = [
    {
      label: "互通底线",
      note: "先保证能协商、能播放、能排障",
      codecs: data.codecs.filter((codec) => codec.tier === "baseline"),
    },
    {
      label: "增强策略",
      note: "再为弱网、画质、分层能力付出代价",
      codecs: data.codecs.filter((codec) => codec.tier === "enhancement"),
    },
  ];
  const selectScenario = (index: number) => {
    const nextScenario = data.scenarios[index];
    setSelection({
      codecLabel: nextScenario.preferredCodecs[0] ?? data.codecs[0]?.label ?? "",
      scenarioIndex: index,
    });
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      const isFormField =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;
      if (isFormField) return;
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp" && event.key !== "Enter") return;

      setSelection((current) => {
        const currentScenario = data.scenarios[current.scenarioIndex] ?? data.scenarios[0];
        if (event.key === "Enter") {
          event.preventDefault();
          event.stopPropagation();
          const preferredCodecs =
            currentScenario.preferredCodecs.length > 0
              ? currentScenario.preferredCodecs
              : [current.codecLabel || defaultCodecLabel];
          const selectedIndex = preferredCodecs.indexOf(current.codecLabel);
          return {
            ...current,
            codecLabel: preferredCodecs[wrap(selectedIndex + 1, preferredCodecs.length)] ?? current.codecLabel,
          };
        }

        event.preventDefault();
        event.stopPropagation();
        const direction = event.key === "ArrowUp" ? -1 : 1;
        const nextIndex = wrap(current.scenarioIndex + direction, data.scenarios.length);
        const nextScenario = data.scenarios[nextIndex];
        return {
          codecLabel: nextScenario.preferredCodecs[0] ?? data.codecs[0]?.label ?? current.codecLabel,
          scenarioIndex: nextIndex,
        };
      });
    };

    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", onKeyDown, { capture: true });
  }, [data.codecs, data.scenarios, data.scenarios.length, defaultCodecLabel]);

  return (
    <div className="codec-overview">
      <div className="codec-interaction-hint">
        <MousePointerClick size={17} strokeWidth={1.8} />
        <span>点击场景卡切换课堂情境，再点击编解码卡查看选型理由</span>
        <em>键盘：↑↓ 切场景，Enter 切推荐编码</em>
      </div>

      <div className="codec-logic-flow">
        {data.logicSteps.map((step, index) => (
          <article className={toneClass(step.tone)} key={step.label}>
            <span>{String(index + 1).padStart(2, "0")} · {step.label}</span>
            <strong>{step.question}</strong>
            <p>{step.detail}</p>
          </article>
        ))}
      </div>

      <div className="codec-scenario-strip">
        {data.scenarios.map((scenario, index) => (
          <button
            className={`${toneClass(scenario.tone)} ${index === selection.scenarioIndex ? "active" : ""}`}
            key={scenario.label}
            type="button"
            onClick={() => selectScenario(index)}
          >
            <strong>{scenario.label}</strong>
            <span>{scenario.recommended}</span>
            <em>点击选择</em>
          </button>
        ))}
        </div>

      <div className="codec-decision-layout">
        <div className="codec-tier-groups">
          {codecGroups.map((group) => (
            <section className="codec-tier-group" key={group.label}>
              <div className="codec-tier-title">
                <strong>{group.label}</strong>
                <span>{group.note}</span>
              </div>
              <div className="codec-overview-grid">
                {group.codecs.map((codec) => {
                  const preferred = preferredSet.has(codec.label);
                  const selected = codec.label === activeCodec.label;
                  return (
                    <button
                      className={`${toneClass(codec.tone)} ${preferred ? "preferred" : ""} ${selected ? "active" : ""}`}
                      key={codec.label}
                      type="button"
                      onClick={() => setSelection((current) => ({ ...current, codecLabel: codec.label }))}
                    >
                      <div>
                        <strong>{codec.label}</strong>
                        <span>{codec.kind}</span>
                      </div>
                      <p>
                        <em>{preferred ? "推荐" : codec.tier === "baseline" ? "底线" : "增强"}</em>
                        {codec.role}
                      </p>
                      <span className="codec-primary-metric">
                        {codec.metrics[0]?.label}: {codec.metrics[0]?.value}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <aside
          className={`codec-inspector ${toneClass(activeCodec.tone)}`}
          aria-live="polite"
        >
          <span>当前场景：{activeScenario.label}</span>
          <strong>{activeCodec.label} · {activeCodec.role}</strong>
          <p>{activeCodec.decision}</p>
          <div className="codec-metric-grid">
            {activeCodec.metrics.map((metric) => (
              <div key={metric.label}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
                <small>{metric.note}</small>
              </div>
            ))}
          </div>
          <dl>
            <div>
              <dt>特点</dt>
              <dd>{activeCodec.strength}</dd>
            </div>
            <div>
              <dt>代价</dt>
              <dd>{activeCodec.cost}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}

export function AudioProcessing({
  data,
  interactionCommand,
}: InteractiveVisualProps<AudioProcessingData>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scenario = data.scenarios[activeIndex];

  useEffect(() => {
    if (interactionCommand.tick === 0) return;
    setActiveIndex((value) => wrap(value + interactionCommand.direction, data.scenarios.length));
  }, [data.scenarios.length, interactionCommand]);

  return (
    <div className="audio-processing">
      <div className="audio-case-tabs">
        {data.scenarios.map((item, index) => (
          <button
            className={`${index === activeIndex ? "active" : ""}`}
            key={item.label}
            type="button"
            onClick={() => setActiveIndex(index)}
          >
            <strong>{item.label}</strong>
            <span>{item.codec}</span>
          </button>
        ))}
      </div>

      <div className="audio-pipeline">
        {scenario.stages.map((stage, index) => (
          <article className={`${toneClass(stage.tone)} state-${stage.setting}`} key={stage.label}>
            <span>{stage.label}</span>
            <strong>
              {stage.setting === "on" ? "ON" : stage.setting === "off" ? "OFF" : "CAREFUL"}
            </strong>
            <p>{stage.detail}</p>
            {index < scenario.stages.length - 1 ? <i aria-hidden="true" /> : null}
          </article>
        ))}
      </div>

      <div className="audio-inspector">
        <div>
          <span>{scenario.capture}</span>
          <strong>{scenario.prompt}</strong>
        </div>
        <p>{scenario.answer}</p>
      </div>
    </div>
  );
}

export function VideoParameters({
  data,
  interactionCommand,
}: InteractiveVisualProps<VideoParametersData>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = data.cases[activeIndex];

  useEffect(() => {
    if (interactionCommand.tick === 0) return;
    setActiveIndex((value) => wrap(value + interactionCommand.direction, data.cases.length));
  }, [data.cases.length, interactionCommand]);

  return (
    <div className="video-parameters">
      <div className="video-case-switcher">
        {data.cases.map((item, index) => (
          <button
            className={index === activeIndex ? "active" : ""}
            key={item.label}
            type="button"
            onClick={() => setActiveIndex(index)}
          >
            <strong>{item.label}</strong>
            <span>{item.symptom}</span>
          </button>
        ))}
      </div>

      <div className="video-diagnostic">
        <section>
          <span>诊断</span>
          <strong>{current.diagnosis}</strong>
          <p>{current.recommendation}</p>
        </section>
        <div className="video-metrics">
          {current.metrics.map((metric) => (
            <div className={toneClass(metric.tone)} key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="video-levers">
        {current.levers.map((lever) => (
          <article className={toneClass(lever.tone)} key={lever.label}>
            <span>{lever.label}</span>
            <strong>{lever.choice}</strong>
            <p>{lever.impact}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export function LayeredEncoding({
  data,
  interactionCommand,
}: InteractiveVisualProps<LayeredEncodingData>) {
  const [activeReceiver, setActiveReceiver] = useState(0);
  const [activeMode, setActiveMode] = useState(0);
  const mode = data.modes[activeMode];
  const receiver = data.receivers[activeReceiver];

  useEffect(() => {
    if (interactionCommand.tick === 0) return;
    if (interactionCommand.action === "activate") {
      setActiveMode((value) => wrap(value + 1, data.modes.length));
      return;
    }
    setActiveReceiver((value) => wrap(value + interactionCommand.direction, data.receivers.length));
  }, [
    data.modes.length,
    data.receivers.length,
    interactionCommand.action,
    interactionCommand.direction,
    interactionCommand.tick,
  ]);

  return (
    <div className="layered-encoding">
      <div className="layer-mode-header">
        <div>
          <span>Enter 切换模式</span>
          <strong>{mode.label}</strong>
          <p>{mode.summary}</p>
        </div>
        <em>{mode.tradeoff}</em>
      </div>

      <div className="layer-flow">
        <div className="layer-stack">
          {mode.layers.map((layer) => {
            const active = receiver.subscription.includes(layer.label) || receiver.subscription.includes(layer.resolution);
            return (
              <article
                className={`${toneClass(layer.tone)} ${active ? "active" : ""}`}
                key={layer.label}
              >
                <strong>{layer.label}</strong>
                <span>{layer.resolution}</span>
                <em>{layer.bitrate}</em>
                <p>{layer.dependency}</p>
              </article>
            );
          })}
        </div>
        <div className="layer-sfu-node">
          <span>SFU</span>
          <strong>select layer</strong>
          <p>{mode.serverBehavior}</p>
        </div>
        <div className="layer-receiver-list">
          {data.receivers.map((item, index) => (
            <button
              className={`${toneClass(item.tone)} ${index === activeReceiver ? "active" : ""}`}
              key={item.label}
              type="button"
              onClick={() => setActiveReceiver(index)}
            >
              <strong>{item.label}</strong>
              <span>{item.subscription}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={`layer-inspector ${toneClass(receiver.tone)}`}>
        <strong>{receiver.layout}</strong>
        <span>{receiver.network}</span>
        <p>{receiver.why}</p>
      </div>
    </div>
  );
}

export function CodecTradeoff({
  data,
  interactionCommand,
}: InteractiveVisualProps<CodecTradeoffData>) {
  const [activeOption, setActiveOption] = useState(4);
  const [activeCriterion, setActiveCriterion] = useState(0);
  const option = data.options[activeOption];
  const criterion = data.criteria[activeCriterion];

  useEffect(() => {
    if (interactionCommand.tick === 0) return;
    if (interactionCommand.action === "activate") {
      setActiveCriterion((value) => wrap(value + 1, data.criteria.length));
      return;
    }
    setActiveOption((value) => wrap(value + interactionCommand.direction, data.options.length));
  }, [
    data.criteria.length,
    data.options.length,
    interactionCommand.action,
    interactionCommand.direction,
    interactionCommand.tick,
  ]);

  return (
    <div className="codec-tradeoff">
      <div className="tradeoff-scenario">
        <span>弱网移动端</span>
        <strong>{data.scenario}</strong>
      </div>

      <div className="tradeoff-grid">
        {data.options.map((candidate, index) => (
          <button
            className={`${toneClass(candidate.tone)} ${index === activeOption ? "active" : ""}`}
            key={candidate.label}
            type="button"
            onClick={() => setActiveOption(index)}
          >
            <strong>{candidate.label}</strong>
            <span>{candidate.verdict}</span>
            <i style={{ width: `${candidate.scores[activeCriterion] * 20}%` }} />
          </button>
        ))}
      </div>

      <div className={`tradeoff-inspector ${toneClass(option.tone)}`}>
        <div>
          <span>{criterion.label}: {criterion.question}</span>
          <strong>{option.label}</strong>
        </div>
        <section>
          <article>
            <span>短期兜底</span>
            <p>{option.shortTerm}</p>
          </article>
          <article>
            <span>长期演进</span>
            <p>{option.longTerm}</p>
          </article>
          <article>
            <span>副作用</span>
            <p>{option.risk}</p>
          </article>
        </section>
      </div>
    </div>
  );
}

export function SignalChain({
  data,
  interactionCommand,
}: InteractiveVisualProps<SignalChainData>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = data.nodes[activeIndex];

  useEffect(() => {
    if (interactionCommand.tick === 0) return;
    setActiveIndex((value) => wrap(value + interactionCommand.direction, data.nodes.length));
  }, [data.nodes.length, interactionCommand]);

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
          <span>{active.metric}</span>
        </div>
      </div>
    </div>
  );
}

export function LatencyBudget({
  data,
  interactionCommand,
}: InteractiveVisualProps<LatencyBudgetData>) {
  const [pressure, setPressure] = useState(42);

  useEffect(() => {
    if (interactionCommand.tick === 0) return;
    setPressure((value) =>
      Math.min(100, Math.max(0, value + interactionCommand.direction * 14)),
    );
  }, [interactionCommand]);

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

export function JitterSync({
  data,
  interactionCommand,
}: InteractiveVisualProps<JitterSyncData>) {
  const [mode, setMode] = useState<"jitter" | "sync">("jitter");
  const arrivalWidth = Math.max(...data.playout) + 40;

  useEffect(() => {
    if (interactionCommand.tick === 0) return;
    setMode((value) => (value === "jitter" ? "sync" : "jitter"));
  }, [interactionCommand]);

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

export function QosQoeMatrix({
  data,
  interactionCommand,
}: InteractiveVisualProps<QosQoeMatrixData>) {
  const [focus, setFocus] = useState<"qos" | "qoe">("qoe");

  useEffect(() => {
    if (interactionCommand.tick === 0) return;
    setFocus((value) => (value === "qos" ? "qoe" : "qos"));
  }, [interactionCommand]);

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
          <div className="matrix-row" key={row.qosMetric}>
            <div className="metric-chip">
              <Activity size={18} strokeWidth={1.6} />
              {focus === "qos" ? row.qosMetric : row.qoeMetric}
            </div>
            <p>{focus === "qos" ? row.qos : row.qoe}</p>
            <span>{row.tradeoff}</span>
            <em>{focus === "qos" ? row.qosSignal : row.qoeSignal}</em>
          </div>
        ))}
      </div>
    </div>
  );
}
