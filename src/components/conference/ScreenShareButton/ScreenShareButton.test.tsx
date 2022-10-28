import { Status } from '../../../hooks/types/misc';
import { fireEvent, render, waitFor } from '../../../utils/tests/test-utils';

import ScreenShareButton from './ScreenShareButton';

const activeText = 'Stop present';
const inactiveText = 'Present';
const testID = 'testID';
const testPropID = 'testProp';

const actionMock = jest.fn();
const setSharingErrorsMock = jest.fn();

let status = Status.Active;
let isLocalUserPresentationOwner = false;
let sharingInProgressError = false;

jest.mock('../../../hooks/useScreenSharing', () => {
  return jest.fn(() => ({
    ...jest.requireActual('../../../hooks/useScreenSharing'),
    status,
    stopScreenShare: jest.fn(() => true),
    startScreenShare: jest.fn(() => true),
    isLocalUserPresentationOwner,
    sharingInProgressError,
    setSharingErrors: setSharingErrorsMock,
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
  status = Status.Active;
  isLocalUserPresentationOwner = false;
});

const props = { testID, activeTooltipText: activeText, inactiveTooltipText: inactiveText };

describe('ScreenShareButton component', () => {
  test('Passes TestID', () => {
    const { getByTestId } = render(<ScreenShareButton {...props} />);
    expect(getByTestId(testID)).not.toBeNull();
  });
  test('Displays stop present text props', () => {
    const { getByText } = render(<ScreenShareButton {...props} />);

    expect(getByText(activeText)).not.toBeNull();
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
    await waitFor(() => expect(setSharingErrorsMock).toHaveBeenCalledTimes(1));
  });
});
