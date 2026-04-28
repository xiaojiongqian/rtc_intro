import { Camera, Check, Mic, RefreshCw, X } from "lucide-react";
import type {
  MediaDevicePickerState,
  MediaDeviceSelection,
} from "./types";

type DevicePickerModalProps = {
  picker: MediaDevicePickerState;
  selection: MediaDeviceSelection;
  onApply: () => void;
  onClose: () => void;
  onRefresh: () => void;
  onSelectionChange: (selection: MediaDeviceSelection) => void;
};

export function DevicePickerModal({
  picker,
  selection,
  onApply,
  onClose,
  onRefresh,
  onSelectionChange,
}: DevicePickerModalProps) {
  if (!picker.open) return null;

  const updateSelection = (patch: Partial<MediaDeviceSelection>) => {
    onSelectionChange({ ...selection, ...patch });
  };
  const canApply =
    !picker.loading && (selection.audioEnabled || selection.videoEnabled);

  return (
    <div className="lab-device-backdrop" role="presentation">
      <section
        aria-labelledby="device-picker-title"
        aria-modal="true"
        className="lab-device-modal"
        role="dialog"
      >
        <header>
          <div>
            <span>Media devices</span>
            <strong id="device-picker-title">选择摄像头/麦克风</strong>
          </div>
          <button
            className="icon-button"
            onClick={onClose}
            title="关闭"
            type="button"
          >
            <X size={18} />
          </button>
        </header>

        {picker.error ? <div className="lab-error">{picker.error}</div> : null}

        <div className="lab-device-grid">
          <article>
            <label className="lab-device-toggle">
              <input
                checked={selection.videoEnabled && picker.videoInputs.length > 0}
                disabled={picker.loading || picker.videoInputs.length === 0}
                onChange={(event) =>
                  updateSelection({ videoEnabled: event.target.checked })
                }
                type="checkbox"
              />
              <Camera size={18} />
              <span>摄像头</span>
            </label>
            <select
              aria-label="摄像头"
              disabled={
                picker.loading ||
                !selection.videoEnabled ||
                picker.videoInputs.length === 0
              }
              onChange={(event) =>
                updateSelection({
                  videoDeviceId: event.target.value || undefined,
                })
              }
              value={selection.videoDeviceId ?? ""}
            >
              <option value="">默认摄像头</option>
              {picker.videoInputs.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </option>
              ))}
            </select>
          </article>

          <article>
            <label className="lab-device-toggle">
              <input
                checked={selection.audioEnabled && picker.audioInputs.length > 0}
                disabled={picker.loading || picker.audioInputs.length === 0}
                onChange={(event) =>
                  updateSelection({ audioEnabled: event.target.checked })
                }
                type="checkbox"
              />
              <Mic size={18} />
              <span>麦克风</span>
            </label>
            <select
              aria-label="麦克风"
              disabled={
                picker.loading ||
                !selection.audioEnabled ||
                picker.audioInputs.length === 0
              }
              onChange={(event) =>
                updateSelection({
                  audioDeviceId: event.target.value || undefined,
                })
              }
              value={selection.audioDeviceId ?? ""}
            >
              <option value="">默认麦克风</option>
              {picker.audioInputs.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </option>
              ))}
            </select>
          </article>
        </div>

        <footer>
          <button
            className="lab-command secondary"
            disabled={picker.loading}
            onClick={onRefresh}
            type="button"
          >
            <RefreshCw size={18} />
            重新扫描
          </button>
          <button className="lab-command warning" onClick={onClose} type="button">
            取消
          </button>
          <button
            className="lab-command"
            disabled={!canApply}
            onClick={onApply}
            type="button"
          >
            <Check size={18} />
            使用所选设备
          </button>
        </footer>
      </section>
    </div>
  );
}
