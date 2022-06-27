export type Camera = {
  /**
   * Gets the list of the available cameras.
   * @returns the list of available cameras.
   */
  getCameras: () => Promise<MediaDeviceInfo[]>;

  /**
   * Selects a camera.
   * @param deviceId - Identifier of the camera to use.
   * @returns the identifier of the camera selected.
   */
  selectCamera: (deviceId: string) => Promise<string>;

  /**
   * Gets data of default camera.
   * @returns the default camera device information.
   */
  getDefaultLocalCamera: () => Promise<MediaDeviceInfo>;

  /**
   * Check status of browser camera permissions.
   * @returns whether the permissions are granted to access the camera or not.
   */
  getCameraPermission: () => Promise<boolean>;
}

export type UseCamera = () => Camera;
