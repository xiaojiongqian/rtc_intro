export const formatNumber = (
  value: number | undefined,
  digits = 0,
  suffix = "",
) =>
  typeof value === "number" && Number.isFinite(value)
    ? `${value.toFixed(digits)}${suffix}`
    : "N/A";

export const formatPercent = (value: number | undefined) =>
  typeof value === "number" && Number.isFinite(value)
    ? `${(value * 100).toFixed(1)}%`
    : "N/A";

export const enabledTrackCount = (stream: MediaStream | null, kind: "audio" | "video") =>
  stream?.getTracks().filter((track) => track.kind === kind && track.enabled).length ?? 0;
