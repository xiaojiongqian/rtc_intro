import type { RoomStatsSnapshot, RtcStatsSnapshot } from "./types";

type ReportBaseline = {
  timestamp: number;
  bytesSent?: number;
  bytesReceived?: number;
  framesEncoded?: number;
  framesSent?: number;
  framesDecoded?: number;
  packetsLost?: number;
  packetsReceived?: number;
  concealedSamples?: number;
  totalSamplesReceived?: number;
  jitterBufferDelay?: number;
  jitterBufferEmittedCount?: number;
};

export type StatsBaseline = Map<string, ReportBaseline>;

const secondsToMs = (value?: number) =>
  typeof value === "number" && Number.isFinite(value) ? value * 1000 : undefined;

const bpsToKbps = (value?: number) =>
  typeof value === "number" && Number.isFinite(value) ? value / 1000 : undefined;

const bitrateFromDelta = (
  currentBytes: number | undefined,
  previousBytes: number | undefined,
  currentTimestamp: number,
  previousTimestamp: number | undefined,
) => {
  if (
    typeof currentBytes !== "number" ||
    typeof previousBytes !== "number" ||
    typeof previousTimestamp !== "number"
  ) {
    return undefined;
  }
  const deltaSeconds = (currentTimestamp - previousTimestamp) / 1000;
  if (deltaSeconds <= 0) return undefined;
  const deltaBytes = currentBytes - previousBytes;
  if (deltaBytes < 0) return undefined;
  return (8 * deltaBytes) / deltaSeconds / 1000;
};

const fpsFromDelta = (
  currentFrames: number | undefined,
  previousFrames: number | undefined,
  currentTimestamp: number,
  previousTimestamp: number | undefined,
) => {
  if (
    typeof currentFrames !== "number" ||
    typeof previousFrames !== "number" ||
    typeof previousTimestamp !== "number"
  ) {
    return undefined;
  }
  const deltaSeconds = (currentTimestamp - previousTimestamp) / 1000;
  if (deltaSeconds <= 0) return undefined;
  const deltaFrames = currentFrames - previousFrames;
  if (deltaFrames < 0) return undefined;
  return deltaFrames / deltaSeconds;
};

const deltaFrom = (current?: number, previous?: number) => {
  if (typeof current !== "number" || typeof previous !== "number") return undefined;
  const delta = current - previous;
  return delta >= 0 ? delta : undefined;
};

const codecName = (codecReport?: RTCStats) => {
  if (!codecReport) return undefined;
  const report = codecReport as RTCStats & {
    mimeType?: string;
    sdpFmtpLine?: string;
  };
  const mime = report.mimeType?.replace(/^video\//i, "").replace(/^audio\//i, "");
  if (!mime) return undefined;
  return mime.toUpperCase();
};

const codecFromReport = (
  item: Record<string, unknown>,
  codecReports: Map<string, RTCStats>,
) => {
  const codecId = item.codecId;
  if (typeof codecId === "string") {
    return codecName(codecReports.get(codecId));
  }

  const mimeType = item.mimeType;
  if (typeof mimeType === "string") {
    return mimeType.replace(/^video\//i, "").replace(/^audio\//i, "").toUpperCase();
  }

  return undefined;
};

const mediaBitrate = (audio?: number, video?: number) => {
  if (typeof audio !== "number" && typeof video !== "number") return undefined;
  return (audio ?? 0) + (video ?? 0);
};

const maxMaybe = (current: number | undefined, next: number | undefined) => {
  if (typeof next !== "number") return current;
  if (typeof current !== "number") return next;
  return Math.max(current, next);
};

export const collectStats = async (
  pc: RTCPeerConnection,
  previous: StatsBaseline = new Map(),
): Promise<{ snapshot: RtcStatsSnapshot; baseline: StatsBaseline }> => {
  const reports = await pc.getStats();
  const nextBaseline: StatsBaseline = new Map();
  const codecReports = new Map<string, RTCStats>();
  const reportById = new Map<string, RTCStats & Record<string, unknown>>();
  const snapshot: RtcStatsSnapshot = {
    timestamp: Date.now(),
    connection: {
      state: pc.connectionState,
      iceState: pc.iceConnectionState,
    },
    outbound: {},
    inbound: {},
  };

  reports.forEach((report) => {
    reportById.set(report.id, report as RTCStats & Record<string, unknown>);
    if (report.type === "codec") codecReports.set(report.id, report);
  });

  const selectedPairIds = new Set<string>();
  reportById.forEach((item) => {
    if (item.type === "transport" && typeof item.selectedCandidatePairId === "string") {
      selectedPairIds.add(item.selectedCandidatePairId);
    }
  });

  let selectedPair: (RTCStats & Record<string, unknown>) | undefined;
  for (const id of selectedPairIds) {
    selectedPair = reportById.get(id);
    if (selectedPair) break;
  }
  selectedPair ??= [...reportById.values()].find(
    (item) =>
      item.type === "candidate-pair" &&
      (item.selected === true ||
        (item.nominated === true && item.state === "succeeded")),
  );

  if (selectedPair) {
    snapshot.connection.currentRoundTripTimeMs = secondsToMs(
      selectedPair.currentRoundTripTime as number | undefined,
    );
    snapshot.connection.availableOutgoingBitrateKbps = bpsToKbps(
      selectedPair.availableOutgoingBitrate as number | undefined,
    );

    const localCandidateId = selectedPair.localCandidateId;
    const localCandidate =
      typeof localCandidateId === "string" ? reportById.get(localCandidateId) : undefined;
    if (localCandidate?.candidateType) {
      snapshot.connection.candidateType = String(localCandidate.candidateType);
    }
  }

  let intervalPacketsLost = 0;
  let intervalPacketsReceived = 0;
  let hasIntervalLoss = false;

  reports.forEach((report) => {
    const item = report as RTCStats & Record<string, unknown>;
    const previousReport = previous.get(report.id);

    nextBaseline.set(report.id, {
      timestamp: report.timestamp,
      bytesSent: item.bytesSent as number | undefined,
      bytesReceived: item.bytesReceived as number | undefined,
      framesEncoded: item.framesEncoded as number | undefined,
      framesSent: item.framesSent as number | undefined,
      framesDecoded: item.framesDecoded as number | undefined,
      packetsLost: item.packetsLost as number | undefined,
      packetsReceived: item.packetsReceived as number | undefined,
      concealedSamples: item.concealedSamples as number | undefined,
      totalSamplesReceived: item.totalSamplesReceived as number | undefined,
      jitterBufferDelay: item.jitterBufferDelay as number | undefined,
      jitterBufferEmittedCount: item.jitterBufferEmittedCount as number | undefined,
    });

    if (report.type === "outbound-rtp") {
      const kind = item.kind ?? item.mediaType;
      const bitrate = bitrateFromDelta(
        item.bytesSent as number | undefined,
        previousReport?.bytesSent,
        report.timestamp,
        previousReport?.timestamp,
      );
      const fps =
        (item.framesPerSecond as number | undefined) ??
        fpsFromDelta(
          (item.framesEncoded as number | undefined) ??
            (item.framesSent as number | undefined),
          previousReport?.framesEncoded ?? previousReport?.framesSent,
          report.timestamp,
          previousReport?.timestamp,
        );

      if (kind === "audio") {
        snapshot.outbound.audioBitrateKbps = bitrate;
      }

      if (kind === "video") {
        snapshot.outbound.videoBitrateKbps = bitrate;
        snapshot.outbound.framesPerSecond = fps;
        snapshot.outbound.frameWidth = item.frameWidth as number | undefined;
        snapshot.outbound.frameHeight = item.frameHeight as number | undefined;
        snapshot.outbound.nackCount = item.nackCount as number | undefined;
        snapshot.outbound.pliCount = item.pliCount as number | undefined;
        snapshot.outbound.firCount = item.firCount as number | undefined;
        snapshot.outbound.codec = codecFromReport(item, codecReports);
      }

      snapshot.outbound.packetsSent =
        (snapshot.outbound.packetsSent ?? 0) +
        ((item.packetsSent as number | undefined) ?? 0);
      snapshot.outbound.bytesSent =
        (snapshot.outbound.bytesSent ?? 0) +
        ((item.bytesSent as number | undefined) ?? 0);
    }

    if (report.type === "inbound-rtp") {
      const kind = item.kind ?? item.mediaType;
      const bitrate = bitrateFromDelta(
        item.bytesReceived as number | undefined,
        previousReport?.bytesReceived,
        report.timestamp,
        previousReport?.timestamp,
      );

      if (kind === "audio") {
        const concealedSamples = item.concealedSamples as number | undefined;
        const totalSamples = item.totalSamplesReceived as number | undefined;
        const concealedDelta = deltaFrom(concealedSamples, previousReport?.concealedSamples);
        const totalSamplesDelta = deltaFrom(
          totalSamples,
          previousReport?.totalSamplesReceived,
        );
        snapshot.inbound.audioBitrateKbps = bitrate;
        snapshot.inbound.concealedSamples = concealedSamples;
        snapshot.inbound.concealmentRate =
          typeof concealedDelta === "number" &&
          typeof totalSamplesDelta === "number" &&
          totalSamplesDelta > 0
            ? concealedDelta / totalSamplesDelta
            : concealedSamples && totalSamples
              ? concealedSamples / totalSamples
              : undefined;
      }

      if (kind === "video") {
        snapshot.inbound.videoBitrateKbps = bitrate;
        snapshot.inbound.framesDecoded = item.framesDecoded as number | undefined;
        snapshot.inbound.framesPerSecond =
          (item.framesPerSecond as number | undefined) ??
          fpsFromDelta(
            item.framesDecoded as number | undefined,
            previousReport?.framesDecoded,
            report.timestamp,
            previousReport?.timestamp,
          );
        snapshot.inbound.framesDropped = item.framesDropped as number | undefined;
        snapshot.inbound.freezeCount = item.freezeCount as number | undefined;
        snapshot.inbound.codec = codecFromReport(item, codecReports);
      }

      const packetsLost = item.packetsLost as number | undefined;
      const packetsReceived = item.packetsReceived as number | undefined;
      const lostDelta = deltaFrom(packetsLost, previousReport?.packetsLost);
      const receivedDelta = deltaFrom(
        packetsReceived,
        previousReport?.packetsReceived,
      );
      if (typeof lostDelta === "number" && typeof receivedDelta === "number") {
        intervalPacketsLost += lostDelta;
        intervalPacketsReceived += receivedDelta;
        hasIntervalLoss = true;
      }
      snapshot.inbound.packetsLost =
        (snapshot.inbound.packetsLost ?? 0) + (packetsLost ?? 0);
      snapshot.inbound.packetsReceived =
        (snapshot.inbound.packetsReceived ?? 0) + (packetsReceived ?? 0);
      snapshot.inbound.jitterMs = maxMaybe(
        snapshot.inbound.jitterMs,
        secondsToMs(item.jitter as number | undefined),
      );
      if (
        typeof item.jitterBufferDelay === "number" &&
        typeof item.jitterBufferEmittedCount === "number"
      ) {
        const delayDelta = deltaFrom(
          item.jitterBufferDelay,
          previousReport?.jitterBufferDelay,
        );
        const emittedDelta = deltaFrom(
          item.jitterBufferEmittedCount,
          previousReport?.jitterBufferEmittedCount,
        );
        const jitterBufferDelayMs =
          typeof delayDelta === "number" &&
          typeof emittedDelta === "number" &&
          emittedDelta > 0
            ? (delayDelta / emittedDelta) * 1000
            : item.jitterBufferEmittedCount > 0
              ? (item.jitterBufferDelay / item.jitterBufferEmittedCount) * 1000
              : undefined;
        snapshot.inbound.jitterBufferDelayMs = maxMaybe(
          snapshot.inbound.jitterBufferDelayMs,
          jitterBufferDelayMs,
        );
      }
    }

    if (report.type === "remote-inbound-rtp") {
      snapshot.connection.currentRoundTripTimeMs ??= secondsToMs(
        item.roundTripTime as number | undefined,
      );
    }
  });

  const intervalPackets = intervalPacketsLost + intervalPacketsReceived;
  if (hasIntervalLoss && intervalPackets > 0) {
    snapshot.inbound.packetLossRate = intervalPacketsLost / intervalPackets;
  } else {
    const totalPackets =
      (snapshot.inbound.packetsLost ?? 0) + (snapshot.inbound.packetsReceived ?? 0);
    snapshot.inbound.packetLossRate =
      totalPackets > 0 ? (snapshot.inbound.packetsLost ?? 0) / totalPackets : undefined;
  }

  return { snapshot, baseline: nextBaseline };
};

const sumDefined = (values: Array<number | undefined>) => {
  const defined = values.filter((value): value is number => typeof value === "number");
  if (defined.length === 0) return undefined;
  return defined.reduce((total, value) => total + value, 0);
};

const maxDefined = (values: Array<number | undefined>) => {
  const defined = values.filter((value): value is number => typeof value === "number");
  if (defined.length === 0) return undefined;
  return Math.max(...defined);
};

const avgDefined = (values: Array<number | undefined>) => {
  const total = sumDefined(values);
  if (typeof total !== "number") return undefined;
  return total / values.filter((value) => typeof value === "number").length;
};

export const aggregateRoomStats = (
  peerCount: number,
  snapshots: RtcStatsSnapshot[],
): RoomStatsSnapshot => ({
  peerCount,
  activeConnections: snapshots.length,
  theoreticalConnections: (peerCount * Math.max(peerCount - 1, 0)) / 2,
  totalOutgoingKbps: sumDefined(
    snapshots.map((snapshot) =>
      mediaBitrate(
        snapshot.outbound.audioBitrateKbps,
        snapshot.outbound.videoBitrateKbps,
      ),
    ),
  ),
  totalIncomingKbps: sumDefined(
    snapshots.map((snapshot) =>
      mediaBitrate(
        snapshot.inbound.audioBitrateKbps,
        snapshot.inbound.videoBitrateKbps,
      ),
    ),
  ),
  worstRttMs: maxDefined(
    snapshots.map((snapshot) => snapshot.connection.currentRoundTripTimeMs),
  ),
  worstLossRate: maxDefined(
    snapshots.map((snapshot) => snapshot.inbound.packetLossRate),
  ),
  averageInboundFps: avgDefined(
    snapshots.map((snapshot) => snapshot.inbound.framesPerSecond),
  ),
});
