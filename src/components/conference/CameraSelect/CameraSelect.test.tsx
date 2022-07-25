import { createDevice } from '../../../utils/tests/dataCreators.util';
import { fireEvent, render, screen, waitFor } from '../../../utils/tests/test-utils';

import CameraSelect from './CameraSelect';

const label = 'camera-label';
const placeholder = 'camera-placeholder';
const testID = 'testID';

const getCamerasMock = jest
  .fn()
  .mockResolvedValueOnce([createDevice('device1')])
  .mockResolvedValueOnce([createDevice('device1'), createDevice('device2')])
  .mockResolvedValueOnce([createDevice('default'), createDevice('device2')])
  .mockResolvedValue([createDevice('device1'), createDevice('device2')]);

jest.mock('../../../hooks/useCamera', () => {
  return jest.fn(() => ({
    ...jest.requireActual('../../../hooks/useCamera'),
    getCameras: getCamerasMock,
  }));
});

describe('CameraSelect component', () => {
  test('Passes TestID', async () => {
    const { getByTestId } = render(<CameraSelect testID={testID} label={label} placeholder={placeholder} />);
    await waitFor(() => {
      expect(getByTestId(testID)).toBeInTheDocument();
    });
  });
  test('Have label and placeholder when nothing is selected', async () => {
    const { getByText } = render(<CameraSelect testID={testID} label={label} placeholder={placeholder} />);
    await waitFor(async () => {
      const lrx = new RegExp(label, 'i');
      expect(getByText(lrx)).not.toBeNull();
      const prx = new RegExp(placeholder, 'i');
      expect(getByText(prx)).not.toBeNull();
    });
  });
  test('Selects default device if it is available', async () => {
    const { getByText } = render(<CameraSelect testID={testID} label={label} placeholder={placeholder} />);

    await waitFor(async () => {
      const placeholderText = screen.queryByText(placeholder);
      expect(placeholderText).not.toBeInTheDocument();
      const drx = /default/i;
      expect(getByText(drx)).not.toBeNull();
    });
  });
  test('On click opens dropdown with list of devices', async () => {
    const { getByRole } = render(<CameraSelect testID={testID} label={label} placeholder={placeholder} />);
    await waitFor(() => {
      fireEvent.click(getByRole('button'));
      expect(/device1/).not.toBeNull();
      expect(/device2/).not.toBeNull();
    });
  });
});
