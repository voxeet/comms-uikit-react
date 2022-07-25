Object.defineProperty(window, 'MediaRecorder', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    start: jest.fn(),
    ondataavailable: jest.fn(),
    onerror: jest.fn(),
    state: '',
    stop: jest.fn(),
  })),
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

Object.defineProperty(window, 'MediaStream', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    start: jest.fn(),
    ondataavailable: jest.fn(),
    onerror: jest.fn(),
    state: '',
    stop: jest.fn(),
    pause: jest.fn(),
    resume: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  })),
});

Object.defineProperty(MediaStream, 'isTypeSupported', {
  writable: true,
  value: () => true,
});

const mockGetUserMedia = jest.fn(async () => {
  return new Promise<void>((resolve) => {
    resolve();
  });
});

const mockEnumerateDevices = jest.fn(async () => {
  return new Promise<MediaDeviceInfo[]>((resolve) => {
    resolve([
      {
        deviceId: 'default',
        kind: 'audiooutput',
        label: '',
        groupId: 'default',
        toJSON: jest.fn(),
      },
    ]);
  });
});

Object.defineProperty(global.navigator, 'mediaDevices', {
  value: {
    getUserMedia: mockGetUserMedia,
    enumerateDevices: mockEnumerateDevices,
  },
});
