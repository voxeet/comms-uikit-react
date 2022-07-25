export type Speaker = {
  /**
   * Gets the list of the available speakers.
   * @returns the list of available speakers.
   */
  getSpeakers: () => Promise<MediaDeviceInfo[]>;

  /**
   * Selects a speaker.
   * @param deviceId - Identifier of the camera to use.
   * @returns the identifier of the camera selected.
   */
  selectSpeaker: (deviceId: string) => Promise<string>;

  /**
   * Gets data of default speaker.
   * @returns the default speaker device information.
   */
  getDefaultLocalSpeaker: () => Promise<MediaDeviceInfo | null>;

  /**
   * Currently selected local speakers.
   */
  localSpeakers: Partial<MediaDeviceInfo> | null;

  /**
   * Selects local Speakers.
   * @param speakers - MediaDeviceInfo object or null
   */
  setLocalSpeakers: (speakers: Partial<MediaDeviceInfo> | null) => void;
};

export type UseSpeaker = () => Speaker;
