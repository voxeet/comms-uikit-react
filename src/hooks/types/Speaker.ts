export type Speaker = {
  /**
   * Holds the list of the available speakers.
   */
  speakers: MediaDeviceInfo[];

  /**
   * Gets the list of the available speakers.
   * Sets internal speakers state.
   */
  getSpeakers: () => void;

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

  /**
   * Gets currently selected speaker in conference.
   * @returns the default speaker device information.
   */
  getSelectedSpeaker: () => MediaDeviceInfo | undefined;
};

export type UseSpeaker = () => Speaker;
