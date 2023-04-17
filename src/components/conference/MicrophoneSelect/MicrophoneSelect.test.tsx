import { createDevice } from '../../../utils/tests/dataCreators.util';
import { fireEvent, render, screen, waitFor } from '../../../utils/tests/test-utils';

import MicrophoneSelect from './MicrophoneSelect';

const label = 'microphone-label';
const placeholder = 'microphone-placeholder';
const testID = 'testID';
let microphones: MediaDeviceInfo[] = [];

jest.mock('../../../hooks/useMicrophone', () => {
  return jest.fn(() => ({
    ...jest.requireActual('../../../hooks/useMicrophone'),
    microphones,
    getMicrophones: jest.fn(),
    getSelectedMicrophone: jest.fn(),
  }));
});

beforeEach(() => {
  jest.clearAllMocks();
  microphones = [];
});

describe('MicrophoneSelect component', () => {
  test('Renders nothing if no devices', async () => {
    const { queryByTestId } = render(<MicrophoneSelect testID={testID} label={label} placeholder={placeholder} />);
    await waitFor(() => {
      expect(queryByTestId(testID)).toBeNull();
    });
  });
  test('Passes TestID', async () => {
    microphones = [createDevice('device1')];
    const { getByTestId } = render(<MicrophoneSelect testID={testID} label={label} placeholder={placeholder} />);
    await waitFor(() => {
      expect(getByTestId(testID)).toBeInTheDocument();
    });
  });
  test('Have label and placeholder when nothing is selected', async () => {
    microphones = [createDevice('device1'), createDevice('device2')];
    const { getByText } = render(<MicrophoneSelect testID={testID} label={label} placeholder={placeholder} />);
    await waitFor(async () => {
      const lrx = new RegExp(label, 'i');
      expect(getByText(lrx)).not.toBeNull();
      const prx = new RegExp(placeholder, 'i');
      expect(getByText(prx)).not.toBeNull();
    });
  });
  test('Selects default device if it is available', async () => {
    microphones = [createDevice('default')];
    const { getByText } = render(<MicrophoneSelect testID={testID} label={label} placeholder={placeholder} />);

    await waitFor(async () => {
      const placeholderText = screen.queryByText(placeholder);
      expect(placeholderText).not.toBeInTheDocument();
      const drx = /default/i;
      expect(getByText(drx)).not.toBeNull();
    });
  });
  test('On click opens dropdown with list of devices', async () => {
    microphones = [createDevice('device1'), createDevice('device2')];
    const { getByRole } = render(<MicrophoneSelect testID={testID} label={label} placeholder={placeholder} />);
    await waitFor(() => {
      fireEvent.click(getByRole('button'));
      expect(/device1/).not.toBeNull();
      expect(/device2/).not.toBeNull();
    });
  });
});
