import type { QosApplyResult, QosControlState, QosPreset } from "./types";

export const defaultQosState: QosControlState = {
  video: {
    maxBitrateKbps: 1200,
    maxFramerate: 24,
    scaleResolutionDownBy: 1,
    degradationPreference: "balanced",
    contentHint: "motion",
  },
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
  codec: {
    requiresRestart: false,
  },
};

export const qosPresets: QosPreset[] = [
  {
    id: "baseline",
    label: "基线",
    description: "720p / 24fps / 1200kbps，适合作为对照组。",
    state: defaultQosState.video,
  },
  {
    id: "audio-first",
    label: "音频优先",
    description: "视频降到 360p 级别，保语音连续性。",
    state: {
      maxBitrateKbps: 450,
      maxFramerate: 15,
      scaleResolutionDownBy: 2,
      degradationPreference: "maintain-framerate",
      contentHint: "motion",
    },
  },
  {
    id: "low-bitrate",
    label: "低码率",
    description: "压到 300kbps，观察清晰度和帧率如何退让。",
    state: {
      maxBitrateKbps: 300,
      maxFramerate: 18,
      scaleResolutionDownBy: 2,
      degradationPreference: "balanced",
      contentHint: "motion",
    },
  },
  {
    id: "detail",
    label: "课件细节",
    description: "偏向保留文字/课件细节，适合讲 contentHint。",
    state: {
      maxBitrateKbps: 900,
      maxFramerate: 12,
      scaleResolutionDownBy: 1.5,
      degradationPreference: "maintain-resolution",
      contentHint: "detail",
    },
  },
];

export const applyVideoQos = async (
  senders: RTCRtpSender[],
  state: QosControlState["video"],
): Promise<QosApplyResult[]> => {
  const results = await Promise.all(
    senders.map(async (sender) => {
      try {
        const params = sender.getParameters();
        params.encodings = params.encodings?.length ? params.encodings : [{}];
        params.encodings[0] = {
          ...params.encodings[0],
          maxBitrate: Math.round(state.maxBitrateKbps * 1000),
          maxFramerate: state.maxFramerate,
          scaleResolutionDownBy: state.scaleResolutionDownBy,
        };
        (params as RTCRtpSendParameters & {
          degradationPreference?: QosControlState["video"]["degradationPreference"];
        }).degradationPreference = state.degradationPreference;
        await sender.setParameters(params);
        if (sender.track) sender.track.contentHint = state.contentHint;
        return { ok: true, message: "Video sender updated." };
      } catch (error) {
        return {
          ok: false,
          message: error instanceof Error ? error.message : "Video QoS unsupported.",
        };
      }
    }),
  );

  return results.length
    ? results
    : [{ ok: false, message: "No active video sender." }];
};

export const applyContentHint = (
  stream: MediaStream | null,
  hint: QosControlState["video"]["contentHint"],
) => {
  for (const track of stream?.getVideoTracks() ?? []) {
    track.contentHint = hint;
  }
};

export const audioConstraintsFromQos = (
  state: QosControlState["audio"],
): MediaTrackConstraints => ({
  echoCancellation: state.echoCancellation,
  noiseSuppression: state.noiseSuppression,
  autoGainControl: state.autoGainControl,
});

export const videoConstraintsFromQos = (
  state: QosControlState["video"],
): MediaTrackConstraints => ({
  width: { ideal: Math.round(1280 / state.scaleResolutionDownBy) },
  height: { ideal: Math.round(720 / state.scaleResolutionDownBy) },
  frameRate: { ideal: state.maxFramerate, max: state.maxFramerate },
});
