import { createDevice } from '../../../utils/tests/dataCreators.util';
import { fireEvent, render, screen, waitFor } from '../../../utils/tests/test-utils';

import SpeakersSelect from './SpeakersSelect';

const label = 'speakers-label';
const placeholder = 'speakers-placeholder';
const testID = 'testID';
let speakers: MediaDeviceInfo[] = [];

jest.mock('../../../hooks/useSpeaker', () => {
  return jest.fn(() => ({
    ...jest.requireActual('../../../hooks/useSpeaker'),
    getSpeakers: jest.fn(),
    speakers,
    getSelectedSpeaker: jest.fn(),
  }));
});

beforeEach(() => {
  jest.clearAllMocks();
  speakers = [];
});

describe('SpeakersSelect component', () => {
  test('Renders nothing if no devices', async () => {
    const { queryByTestId } = render(<SpeakersSelect testID={testID} label={label} placeholder={placeholder} />);
    await waitFor(() => {
      expect(queryByTestId(testID)).toBeNull();
    });
  });

  test('Passes TestID', async () => {
    speakers = [createDevice('device1')];
    const { getByTestId } = render(<SpeakersSelect testID={testID} label={label} placeholder={placeholder} />);
    await waitFor(() => {
      expect(getByTestId(testID)).toBeInTheDocument();
    });
  });
  test('Have label and placeholder when nothing is selected', async () => {
    speakers = [createDevice('device1'), createDevice('device2')];
    const { getByText } = render(<SpeakersSelect testID={testID} label={label} placeholder={placeholder} />);
    await waitFor(async () => {
      const lrx = new RegExp(label, 'i');
      expect(getByText(lrx)).not.toBeNull();
      const prx = new RegExp(placeholder, 'i');
      expect(getByText(prx)).not.toBeNull();
    });
  });
  test('Selects default device if it is available', async () => {
    speakers = [createDevice('default')];
    const { getByText } = render(<SpeakersSelect testID={testID} label={label} placeholder={placeholder} />);

    await waitFor(async () => {
      const placeholderText = screen.queryByText(placeholder);
      expect(placeholderText).not.toBeInTheDocument();
      const drx = /default/i;
      expect(getByText(drx)).not.toBeNull();
    });
  });
  test('On click opens dropdown with list of devices', async () => {
    speakers = [createDevice('device1'), createDevice('device2')];
    const { getByRole } = render(<SpeakersSelect testID={testID} label={label} placeholder={placeholder} />);
    await waitFor(() => {
      fireEvent.click(getByRole('button'));
      expect(/device1/).not.toBeNull();
      expect(/device2/).not.toBeNull();
    });
  });
});
