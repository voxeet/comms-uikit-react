import useCamera from '../../../hooks/useCamera';
import { render, cleanup, waitFor, fireEvent, act, screen, navigatorReturnMock } from '../../../utils/tests/test-utils';

import VideoLocalView from './VideoLocalView';

const props = {
  testID: 'testID',
};

const swapCamera = jest.fn();

jest.mock('../../../hooks/useCamera', () => {
  return jest.fn(() => ({
    ...jest.requireActual('../../../hooks/useCamera'),
    swapCamera,
    getCameraPermission: jest.fn(async () => {
      return true;
    }),
  }));
});
const useCameraMock = useCamera as jest.MockedFunction<typeof useCamera>;
jest.mock('../../../hooks/useMicrophone', () => {
  return jest.fn(() => ({
    ...jest.requireActual('../../../hooks/useMicrophone'),
    getDefaultLocalMicrophone: jest.fn(() => ({ deviceID: '1234' })),
  }));
});

beforeEach(() => {
  cleanup();
});
afterEach(() => {
  cleanup();
});

let windowSpy: jest.SpyInstance;

beforeEach(() => {
  windowSpy = jest.spyOn(window, 'navigator', 'get');
});

const setMediaDevicesSpy = () => windowSpy.mockImplementation(() => navigatorReturnMock());

describe('VideoLocalView component', () => {
  test('Passes TestID', async () => {
    const { getByTestId } = render(<VideoLocalView {...props} />, { commsProps: { value: { isVideo: false } } });
    await waitFor(() => {
      expect(getByTestId(props.testID)).toBeInTheDocument();
    });
  });
  test('Applying proper styles', async () => {
    const { getByTestId } = render(<VideoLocalView {...props} />, {
      themeValues: {
        isDesktop: false,
      },
    });
    expect(getByTestId('ReverseCameraIcon')).toBeInTheDocument();
    expect(getByTestId(props.testID)).toHaveClass('mobile');
  });
  test('Should call swap camera for mobile', async () => {
    const { getByTestId } = render(<VideoLocalView {...props} />, {
      themeValues: {
        isDesktop: false,
      },
      commsProps: {
        value: { hasCameraPermission: true },
      },
    });
    const swapButton = getByTestId('ReverseCameraIcon');
    fireEvent.click(swapButton);
    expect(swapCamera).toHaveBeenCalledTimes(1);
    const wrapper = getByTestId(props.testID);
    fireEvent.doubleClick(wrapper);
    expect(swapCamera).toHaveBeenCalledTimes(2);
  });
  test('Should properly display fallback for different scenarios', async () => {
    const { getByTestId } = render(<VideoLocalView {...props} />);
    expect(getByTestId('FallbackWrapper')).toBeVisible();
  });
  test('Does not display fallback while stream is present', async () => {
    setMediaDevicesSpy();
    useCameraMock.mockReturnValue({
      ...jest.requireActual('../../../hooks/useCamera'),
      localCamera: { deviceId: 'true' },
      getCameraPermission: jest.fn(async () => {
        return true;
      }),
    });

    await act(async () => {
      await render(<VideoLocalView {...props} />, {
        commsProps: {
          value: {
            hasCameraPermission: true,
            isAudio: false,
            isVideo: true,
          },
        },
        themeValues: {
          isDesktop: true,
        },
      });
    });
    await waitFor(async () => {
      expect(await screen.queryByTestId('FallbackWrapper')).toBeNull();
      expect(await screen.getByTestId('videoTag')).toBeInTheDocument();
    });
  });
});
