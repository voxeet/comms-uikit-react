import { defaultTheme as theme } from '../../../common';

import { render, waitFor } from '../../../utils/tests/test-utils';

import DeviceInfo from './DeviceInfo';

const testID = 'testID';
const deviceName = 'My Camera';

const { colors } = theme;

describe('DeviceInfo component', () => {
  test('Passes TestID', async () => {
    const { getByTestId } = render(<DeviceInfo testID={testID} />, {});
    await waitFor(() => {
      expect(getByTestId(testID)).not.toBeNull();
    });
  });
  test('Passes style props', async () => {
    const { getByTestId } = render(
      <DeviceInfo testID={testID} icon="camera" iconColor="primary.500" textColor="secondary.500" />,
      {},
    );
    await waitFor(() => {
      const textElement = getByTestId(`${testID}Text`);
      const iconElement = getByTestId('icon');
      expect(textElement).toHaveStyle(`color:${colors.secondary[500]}`);
      expect(iconElement).toHaveAttribute('fill', colors.primary[500]);
    });
  });
  test('Displays device name', async () => {
    const { getByText } = render(<DeviceInfo testID={testID} device={deviceName} />, {});
    await waitFor(() => {
      const textElement = getByText(deviceName);
      expect(textElement).not.toBeNull();
    });
  });
});
