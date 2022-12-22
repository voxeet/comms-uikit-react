import { Status } from '../../../hooks/types/misc';
import { ScreenShareTakeoverMessages } from '../../../hooks/types/ScreenShare';
import { fireEvent, render, waitFor } from '../../../utils/tests/test-utils';

import ScreenShareButton from './ScreenShareButton';

const defaultText = 'Present';
const activeText = 'Stop present';
const testID = 'testID';
const testPropID = 'testProp';

const actionMock = jest.fn();
const setSharingErrors = jest.fn();
const startScreenShare = jest.fn(() => true);
const setPendingTakeoverRequest = jest.fn(() => true);

let status = Status.Active;
let isLocalUserPresentationOwner = false;
let sharingInProgressError = false;
let isLackOfBrowserPermissions = false;
let isPendingTakeoverRequest = false;
let message: Record<string, unknown> | null = null;

jest.mock('../../../hooks/useScreenSharing', () => {
  return jest.fn(() => ({
    ...jest.requireActual('../../../hooks/useScreenSharing'),
    status,
    stopScreenShare: jest.fn(() => true),
    startScreenShare,
    isLocalUserPresentationOwner,
    sharingInProgressError,
    setSharingErrors,
    isLackOfBrowserPermissions,
    isPendingTakeoverRequest,
    setPendingTakeoverRequest,
  }));
});

jest.mock('../../../hooks/useMessage', () => {
  return jest.fn(() => ({
    ...jest.requireActual('../../../hooks/useMessage'),
    message,
  }));
});

const RenderProp = ({ flag, callback }: { flag: boolean | undefined; callback: () => void }) => {
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
  status = Status.Active;
  isLocalUserPresentationOwner = false;
  isLackOfBrowserPermissions = false;
  isPendingTakeoverRequest = false;
});

const props = { testID, defaultTooltipText: defaultText, activeTooltipText: activeText };

describe('ScreenShareButton component', () => {
  test('Passes TestID', () => {
    const { getByTestId } = render(<ScreenShareButton {...props} />);
    expect(getByTestId(testID)).not.toBeNull();
  });
  test('Displays start present text props', () => {
    const { getByText } = render(<ScreenShareButton {...props} />);

    expect(getByText(defaultText)).not.toBeNull();
  });
  test('it invokes stop callback action', async () => {
    isLocalUserPresentationOwner = true;
    const { getByRole } = render(<ScreenShareButton {...props} onStopSharingAction={actionMock} />);
    const button = getByRole('button');

    fireEvent.click(button);
    await waitFor(() => expect(actionMock).toHaveBeenCalledTimes(1));
  });
  test('it invokes start callback action', async () => {
    status = Status.Error;
    const { getByRole } = render(<ScreenShareButton {...props} onStartSharingAction={actionMock} />);
    const button = getByRole('button');
    fireEvent.click(button);
    await waitFor(() => expect(actionMock).toHaveBeenCalledTimes(1));
  });
  test('it displays render prop information component', async () => {
    sharingInProgressError = true;
    const { getByTestId } = render(
      <ScreenShareButton
        {...props}
        onStartSharingAction={actionMock}
        renderTakeOver={(flag, callback) => <RenderProp flag={flag} callback={callback} />}
      />,
    );
    const renderPropComponent = getByTestId(testPropID);
    expect(renderPropComponent).toBeInTheDocument();
    const button = renderPropComponent.getElementsByTagName('button')[0];
    fireEvent.click(button);
    await waitFor(() => expect(setSharingErrors).toHaveBeenCalledTimes(1));
  });
  test('Should properly handle lack of permissions', async () => {
    isLackOfBrowserPermissions = true;
    render(
      <ScreenShareButton
        {...props}
        onLackOfBrowserPermissions={actionMock}
        renderTakeOver={(flag, callback) => <RenderProp flag={flag} callback={callback} />}
      />,
    );
    await waitFor(() => {
      expect(actionMock).toHaveBeenCalledTimes(1);
    });
  });
  test('Should properly handle presentation takeover response', async () => {
    isPendingTakeoverRequest = true;
    message = {
      text: ScreenShareTakeoverMessages.ACCEPT,
    };
    status = Status.Other;
    render(
      <ScreenShareButton
        {...props}
        onStartSharingAction={actionMock}
        renderTakeOver={(flag, callback) => <RenderProp flag={flag} callback={callback} />}
      />,
    );
    await waitFor(() => {
      expect(startScreenShare).toHaveBeenCalledTimes(1);
      expect(actionMock).toHaveBeenCalledTimes(1);
    });
  });
});
