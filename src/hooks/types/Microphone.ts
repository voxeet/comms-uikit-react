export type Microphone = {
  /**
   * Gets the list of the available microphones.
   * @returns the list of available microphones.
   */
  getMicrophones: () => Promise<MediaDeviceInfo[]>;

  /**
   * Selects a microphone.
   * @param deviceId - Identifier of the camera to use.
   * @returns the identifier of the camera selected.
   */
  selectMicrophone: (deviceId: string) => Promise<string>;

  /**
   * Check status of browser microphone permissions.
   * @returns whether the permissions are granted to access the camera or not.
   */
  getMicrophonePermission: () => Promise<boolean>;
}

export type UseMicrophone = () => Microphone;
