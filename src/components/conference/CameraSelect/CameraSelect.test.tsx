import { createDevice } from '../../../utils/tests/dataCreators.util';
import { fireEvent, render, screen, waitFor } from '../../../utils/tests/test-utils';

import CameraSelect from './CameraSelect';

const label = 'camera-label';
const placeholder = 'camera-placeholder';
const testID = 'testID';
let cameras: MediaDeviceInfo[] = [];

jest.mock('../../../hooks/useCamera', () => {
  return jest.fn(() => ({
    ...jest.requireActual('../../../hooks/useCamera'),
    getCameras: jest.fn(),
    cameras,
    getSelectedCamera: jest.fn(),
  }));
});

beforeEach(() => {
  jest.clearAllMocks();
  cameras = [];
});

describe('CameraSelect component', () => {
  test('Renders nothing if no devices', async () => {
    const { queryByTestId } = render(<CameraSelect testID={testID} label={label} placeholder={placeholder} />);
    await waitFor(() => {
      expect(queryByTestId(testID)).toBeNull();
    });
  });
  test('Passes TestID', async () => {
    cameras = [createDevice('device1')];
    const { getByTestId } = render(<CameraSelect testID={testID} label={label} placeholder={placeholder} />);
    await waitFor(() => {
      expect(getByTestId(testID)).toBeInTheDocument();
    });
  });
  test('Have label and placeholder when nothing is selected', async () => {
    cameras = [createDevice('device1'), createDevice('device2')];
    const { getByText } = render(<CameraSelect testID={testID} label={label} placeholder={placeholder} />);
    await waitFor(async () => {
      const lrx = new RegExp(label, 'i');
      expect(getByText(lrx)).not.toBeNull();
      const prx = new RegExp(placeholder, 'i');
      expect(getByText(prx)).not.toBeNull();
    });
  });
  test('Selects default device if it is available', async () => {
    cameras = [createDevice('default')];
    const { getByText } = render(<CameraSelect testID={testID} label={label} placeholder={placeholder} />);

    await waitFor(async () => {
      const placeholderText = screen.queryByText(placeholder);
      expect(placeholderText).not.toBeInTheDocument();
      const drx = /default/i;
      expect(getByText(drx)).not.toBeNull();
    });
  });
  test('On click opens dropdown with list of devices', async () => {
    cameras = [createDevice('device1'), createDevice('device2')];
    const { getByRole } = render(<CameraSelect testID={testID} label={label} placeholder={placeholder} />);
    await waitFor(() => {
      fireEvent.click(getByRole('button'));
      expect(/device1/).not.toBeNull();
      expect(/device2/).not.toBeNull();
    });
  });
});
