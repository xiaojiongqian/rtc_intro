import { SlidersHorizontal } from "lucide-react";
import { useMemo } from "react";
import { qosPresets } from "./qosControls";
import type { QosControlState, VideoCodecPreference } from "./types";

type QosPanelProps = {
  qos: QosControlState;
  message: string;
  onVideoChange: (patch: Partial<QosControlState["video"]>) => void;
  onAudioChange: (patch: Partial<QosControlState["audio"]>) => void;
  onCodecChange: (codec?: VideoCodecPreference) => void;
};

const codecOptions: Array<VideoCodecPreference | ""> = ["", "VP8", "H264", "VP9", "AV1"];

const supportedVideoCodecs = () => {
  const supported = new Set(
    globalThis.RTCRtpSender
      ?.getCapabilities?.("video")
      ?.codecs.map((codec) =>
        codec.mimeType.replace(/^video\//i, "").toUpperCase(),
      ) ?? [],
  );
  return codecOptions.filter((codec) => !codec || supported.has(codec));
};

export function QosPanel({
  qos,
  message,
  onVideoChange,
  onAudioChange,
  onCodecChange,
}: QosPanelProps) {
  const availableCodecOptions = useMemo(supportedVideoCodecs, []);

  return (
    <section className="lab-panel-section">
      <div className="lab-qos-presets">
        {qosPresets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onVideoChange(preset.state)}
            type="button"
          >
            <strong>{preset.label}</strong>
            <span>{preset.description}</span>
          </button>
        ))}
      </div>

      <div className="lab-control-card">
        <header>
          <SlidersHorizontal size={18} />
          <strong>真实控制</strong>
          <span>{message}</span>
        </header>

        <label>
          <span>Max bitrate</span>
          <input
            max={1800}
            min={150}
            onChange={(event) =>
              onVideoChange({ maxBitrateKbps: Number(event.target.value) })
            }
            step={50}
            type="range"
            value={qos.video.maxBitrateKbps}
          />
          <em>{qos.video.maxBitrateKbps} kbps</em>
        </label>

        <label>
          <span>Max framerate</span>
          <input
            max={30}
            min={5}
            onChange={(event) =>
              onVideoChange({ maxFramerate: Number(event.target.value) })
            }
            step={1}
            type="range"
            value={qos.video.maxFramerate}
          />
          <em>{qos.video.maxFramerate} fps</em>
        </label>

        <label>
          <span>Resolution scale</span>
          <input
            max={4}
            min={1}
            onChange={(event) =>
              onVideoChange({ scaleResolutionDownBy: Number(event.target.value) })
            }
            step={0.5}
            type="range"
            value={qos.video.scaleResolutionDownBy}
          />
          <em>{qos.video.scaleResolutionDownBy}x</em>
        </label>

        <div className="lab-control-row">
          <label>
            <span>降级偏好</span>
            <select
              onChange={(event) =>
                onVideoChange({
                  degradationPreference: event.target
                    .value as QosControlState["video"]["degradationPreference"],
                })
              }
              value={qos.video.degradationPreference}
            >
              <option value="balanced">balanced</option>
              <option value="maintain-framerate">maintain-framerate</option>
              <option value="maintain-resolution">maintain-resolution</option>
            </select>
          </label>

          <label>
            <span>contentHint</span>
            <select
              onChange={(event) =>
                onVideoChange({
                  contentHint: event.target.value as QosControlState["video"]["contentHint"],
                })
              }
              value={qos.video.contentHint}
            >
              <option value="">default</option>
              <option value="motion">motion</option>
              <option value="detail">detail</option>
              <option value="text">text</option>
            </select>
          </label>
        </div>

        <div className="lab-audio-toggles">
          {(["echoCancellation", "noiseSuppression", "autoGainControl"] as const).map(
            (key) => (
              <label key={key}>
                <input
                  checked={qos.audio[key]}
                  onChange={(event) =>
                    onAudioChange({ [key]: event.target.checked })
                  }
                  type="checkbox"
                />
                <span>{key}</span>
              </label>
            ),
          )}
        </div>

        <label>
          <span>Codec preference</span>
          <select
            onChange={(event) =>
              onCodecChange(
                event.target.value
                  ? (event.target.value as VideoCodecPreference)
                  : undefined,
              )
            }
            value={qos.codec.preferredVideoCodec ?? ""}
          >
            {availableCodecOptions.map((codec) => (
              <option key={codec || "default"} value={codec}>
                {codec || "browser default"}
              </option>
            ))}
          </select>
          {qos.codec.requiresRestart ? (
            <em>需离开并重新加入；当前通话不会热切换</em>
          ) : null}
        </label>
      </div>
    </section>
  );
}
