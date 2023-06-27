import type { ErrorCodes } from '../../providers/CommsProvider';

export enum AudioCaptureMode {
  Unprocessed = 'unprocessed',
  Standard = 'standard',
  Music = 'music',
}

export enum NoiseReductionLevel {
  High = 'high',
  Low = 'low',
}

export enum AudioEchoCancellation {
  On = 'on',
  Off = 'off',
  Default = 'default',
}

export interface modeOptions {
  noiseReductionLevel?: NoiseReductionLevel;
  echoCancellation?: AudioEchoCancellation;
}

export interface AudioCaptureModeOptions {
  mode: AudioCaptureMode;
  modeOptions?: modeOptions;
}

export type AudioProcessing = {
  /**
   * Currently selected audio capture mode
   */
  audioMode?: AudioCaptureModeOptions;
  /**
   * Resolves to selected AudioCaptureMode.
   */
  getAudioCaptureMode: () => Promise<AudioCaptureModeOptions | void>;
  /**
   * Set audio capture mode.
   */
  setAudioCaptureMode: (option: AudioCaptureModeOptions) => Promise<void>;
  /**
   * Indicates echo cancellation mode enabled / disabled
   * It is suggested to disable echo cancellation while setting audio processing mode to "music"
   */
  isEchoCancellationOn: boolean;
  /**
   * Indicates music mode enabled / disabled
   */
  isMusicMode: boolean;
  /**
   * Toggles the echo cancellation mode
   */
  toggleEchoCancellation: () => Promise<void>;
  /**
   * Setter for noise reduction level
   */
  setNoiseReductionLevel: (value: NoiseReductionLevel) => Promise<void>;
  /**
   * Informs if blur is supported by environment.
   */
  isMusicModeSupported: boolean | null;
  /**
   * Errors related to audio processing.
   */
  isError?: boolean;
  /**
   * Removes errors / error related to audio processing.
   */
  removeAudioCaptureError?: (error?: ErrorCodes) => void;
};

export type UseAudioProcessing = () => AudioProcessing;

export enum AudioProcessingMessages {
  MUSIC_MODE_STARTED = 'Music mode started',
  MUSIC_MODE_STOPPED = 'Music mode stopped',
  MUSIC_MODE_FAILED = 'Faild to start music mode',
  PARTICIPANTS_STATUS = 'Participants status',
}
