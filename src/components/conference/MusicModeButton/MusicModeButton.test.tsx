import { render, fireEvent, waitFor } from '../../../utils/tests/test-utils';

import MusicModeButton from './MusicModeButton';

const defaultText = 'Music Mode';
const testID = 'testID';
const testPropID = 'testProp';
const badgeID = 'IconButtonBadge';
let mockAudioMode = {
  mode: 'music',
};
let mockIsMusicMode = true;
const mockIsMusicModeSupported = true;

const actionMock = jest.fn();

jest.mock('../../../hooks/useAudioProcessing', () => {
  return jest.fn(() => ({
    ...jest.requireActual('../../../hooks/useAudioProcessing'),
    setAudioCaptureMode: jest.fn(),
    audioMode: mockAudioMode,
    isMusicMode: mockIsMusicMode,
    isMusicModeSupported: mockIsMusicModeSupported,
  }));
});

const RenderProp = ({ flag, callback }: { flag: boolean; callback: () => void }) => {
  return flag ? (
    <div data-testid={testPropID}>
      <button type="button" onClick={callback}>
        CLICK
      </button>
    </div>
  ) : null;
};

beforeEach(() => {
  jest.clearAllMocks();
});

const props = {
  testID,
  defaultTooltipText: defaultText,
};

describe('MusicModeButton component', () => {
  test('Passes TestID', () => {
    const { getByTestId } = render(<MusicModeButton {...props} />);
    expect(getByTestId(testID)).not.toBeNull();
  });
  test('Displays badge', () => {
    const { getByTestId } = render(<MusicModeButton {...props} />);
    expect(getByTestId(badgeID)).not.toBeNull();
  });
  test('It invokes stop callback action', async () => {
    const { getByRole } = render(<MusicModeButton {...props} onStopMusicModeAction={actionMock} />);
    const button = getByRole('button');

    fireEvent.click(button);
    await waitFor(() => expect(actionMock).toHaveBeenCalledTimes(1));
  });
  test('Should stop confirmation render prop be visible', async () => {
    const { getByTestId } = render(
      <MusicModeButton
        {...props}
        renderStopConfirmation={(flag, callback) => <RenderProp flag={flag} callback={callback} />}
      />,
    );
    const button = getByTestId(testID);
    fireEvent.click(button);
    expect(getByTestId(testPropID)).toBeInTheDocument();
  });
  test('Should start confirmation render prop be visible', async () => {
    mockAudioMode = {
      mode: 'standard',
    };
    mockIsMusicMode = false;
    const { getByTestId } = render(
      <MusicModeButton
        {...props}
        renderStartConfirmation={(flag, callback) => <RenderProp flag={flag} callback={callback} />}
      />,
    );
    const button = getByTestId(testID);
    fireEvent.click(button);
    expect(getByTestId(testPropID)).toBeInTheDocument();
  });
});
