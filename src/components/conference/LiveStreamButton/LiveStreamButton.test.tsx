import { Status as LiveStreamingStatus } from '../../../hooks/types/misc';
import { fireEvent, render, waitFor } from '../../../utils/tests/test-utils';

import LiveStreamButton from './LiveStreamButton';

const defaultText = 'Go Live';
const testID = 'testID';
const testPropID = 'testProp';
const badge = true;
const badgeID = 'IconButtonBadge';

const actionMock = jest.fn();
const setLiveStreamingErrorsMock = jest.fn();

let status = LiveStreamingStatus.Active;
let isLocalUserLiveStreamingOwner = true;
let isLiveStreamingModeActive = true;
const stopLiveStreaming = jest.fn(() => Promise.resolve(true));

jest.mock('../../../hooks/useLiveStreaming', () => {
  return jest.fn(() => ({
    ...jest.requireActual('../../../hooks/useLiveStreaming'),
    status,
    stopLiveStreaming,
    startLiveStreaming: jest.fn(() => true),
    isLocalUserLiveStreamingOwner,
    setRecordingErrors: setLiveStreamingErrorsMock,
    isLiveStreamingModeActive,
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
  status = LiveStreamingStatus.Active;
  isLocalUserLiveStreamingOwner = true;
});

const props = { testID, defaultTooltipText: defaultText, stopStreaming: actionMock, badge };

describe('LiveStreamButton component', () => {
  test('Passes TestID', () => {
    const { getByTestId } = render(
      <LiveStreamButton
        {...props}
        renderDataInput={(flag, callback) => <RenderProp flag={flag} callback={callback} />}
      />,
    );
    expect(getByTestId(testID)).not.toBeNull();
  });
  test('Displays badge', () => {
    const { getByTestId } = render(
      <LiveStreamButton
        {...props}
        renderDataInput={(flag, callback) => <RenderProp flag={flag} callback={callback} />}
      />,
    );
    expect(getByTestId(badgeID)).not.toBeNull();
  });
  test('It invokes stop callback action', async () => {
    const { getByTestId } = render(
      <LiveStreamButton
        {...props}
        renderDataInput={(flag, callback) => <RenderProp flag={flag} callback={callback} />}
      />,
    );
    const button = getByTestId(testID);
    fireEvent.click(button);
    await waitFor(() => expect(stopLiveStreaming).toHaveBeenCalledTimes(1));
  });
  test('Should data input render prop be visible', async () => {
    status = LiveStreamingStatus.Other;
    isLiveStreamingModeActive = false;
    const { getByTestId } = render(
      <LiveStreamButton
        {...props}
        renderDataInput={(flag, callback) => <RenderProp flag={flag} callback={callback} />}
      />,
    );
    const button = getByTestId(testID);
    fireEvent.click(button);
    expect(getByTestId(testPropID)).toBeInTheDocument();
  });
});
