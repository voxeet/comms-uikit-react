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
}

export type UseSpeaker = () => Speaker;
