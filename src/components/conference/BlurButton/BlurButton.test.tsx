// import { Status as RecordingStatus } from '../../../hooks/types/misc';
import useBlur from '../../../hooks/useBlur';
import '../../../../__mocks__/userAgent.mock';
import { fireEvent, render, waitFor } from '../../../utils/tests/test-utils';

import BlurButton from './BlurButton';

const ChromeAgent =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36';
const EdgeAgent =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 Edg/106.0.1370.47';

const SafariAgent =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15';

const FirefoxAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:104.0) Gecko/20100101 Firefox/104.0';

const defaultText = 'Blur';
const activeText = 'Blur Off';
const testID = 'testID';
// const testPropID = 'testProp';

const startBackgroundBlurMock = jest.fn();
const stopVideoProcessingMock = jest.fn();

jest.mock('../../../hooks/useBlur', () => {
  return jest.fn(() => ({
    ...jest.requireActual('../../../hooks/useBlur'),
    startBackgroundBlur: startBackgroundBlurMock,
    stopVideoProcessing: stopVideoProcessingMock,
  }));
});

const mockUseBlur = useBlur as jest.MockedFunction<typeof useBlur>;

beforeEach(() => {
  // @ts-expect-error userAgent by default is readonly
  global.navigator.userAgent = ChromeAgent;
  jest.clearAllMocks();
});

const props = { testID, defaultTooltipText: defaultText, activeTooltipText: activeText };

describe('BlurButton component', () => {
  test('Passes TestID', () => {
    const { getByTestId } = render(<BlurButton {...props} />);
    expect(getByTestId(testID)).not.toBeNull();
  });
  test('Renders only on desktop Chrome and Edge', () => {
    const { getByTestId, rerender, queryByTestId } = render(<BlurButton {...props} />);
    expect(getByTestId(testID)).not.toBeNull();
    // @ts-expect-error userAgent by default is readonly
    global.navigator.userAgent = FirefoxAgent;
    rerender(<BlurButton {...props} />);
    expect(queryByTestId(testID)).toBeNull();
    // @ts-expect-error userAgent by default is readonly
    global.navigator.userAgent = SafariAgent;
    rerender(<BlurButton {...props} />);
    expect(queryByTestId(testID)).toBeNull();
    // @ts-expect-error userAgent by default is readonly
    global.navigator.userAgent = EdgeAgent;
    rerender(<BlurButton {...props} />);
    expect(queryByTestId(testID)).not.toBeNull();
  });
  test('It invokes start/stop action and proper tooltip message', () => {
    const { getByRole, getByText, rerender } = render(<BlurButton {...props} />);
    const button = getByRole('button');
    expect(getByText(defaultText)).not.toBeNull();
    fireEvent.click(button);
    expect(startBackgroundBlurMock).toHaveBeenCalledTimes(1);
    mockUseBlur.mockReturnValue({
      isBlurred: true,
      startBackgroundBlur: startBackgroundBlurMock,
      stopVideoProcessing: stopVideoProcessingMock,
      isSupported: true,
    });
    waitFor(() => {
      rerender(<BlurButton {...props} />);
      expect(getByText(activeText)).not.toBeNull();
      fireEvent.click(button);
      expect(stopVideoProcessingMock).toHaveBeenCalledTimes(1);
    });
  });
});
