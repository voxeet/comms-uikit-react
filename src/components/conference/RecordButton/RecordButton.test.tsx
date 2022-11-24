import { Status as RecordingStatus } from '../../../hooks/types/misc';
import { fireEvent, render, waitFor } from '../../../utils/tests/test-utils';

import RecordButton from './RecordButton';

const defaultText = 'Record';
const activeText = 'Stop recording';
const testID = 'testID';
const testPropID = 'testProp';

const actionMock = jest.fn();
const setRecordingErrorsMock = jest.fn();

let status = RecordingStatus.Active;
let isLocalUserRecordingOwner = true;

jest.mock('../../../hooks/useRecording', () => {
  return jest.fn(() => ({
    ...jest.requireActual('../../../hooks/useRecording'),
    status,
    stopRecording: jest.fn(() => true),
    startRecording: jest.fn(() => true),
    isLocalUserRecordingOwner,
    setRecordingErrors: setRecordingErrorsMock,
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
  status = RecordingStatus.Active;
  isLocalUserRecordingOwner = true;
});

const props = { testID, defaultTooltipText: defaultText, activeTooltipText: activeText };

describe('RecordButton component', () => {
  test('Passes TestID', () => {
    const { getByTestId } = render(<RecordButton {...props} />);
    expect(getByTestId(testID)).not.toBeNull();
  });
  test('Displays stop recording text props', () => {
    const { getByText } = render(<RecordButton {...props} />);
    expect(getByText(activeText)).not.toBeNull();
  });
  test('It invokes stop callback action', async () => {
    const { getByRole } = render(<RecordButton {...props} onStopRecordingAction={actionMock} />);
    const button = getByRole('button');

    fireEvent.click(button);
    await waitFor(() => expect(actionMock).toHaveBeenCalledTimes(1));
  });
  test('It invokes start callback action', async () => {
    status = RecordingStatus.Other;
    const { getByRole } = render(<RecordButton {...props} onStartRecordingAction={actionMock} />);
    const button = getByRole('button');
    fireEvent.click(button);
    await waitFor(() => expect(actionMock).toHaveBeenCalledTimes(1));
  });
  test('It displays render prop information component', async () => {
    const { getByTestId } = render(
      <RecordButton
        {...props}
        onStopRecordingAction={actionMock}
        renderStopConfirmation={(flag, callback) => <RenderProp flag={flag} callback={callback} />}
      />,
    );
    const button = getByTestId(testID);
    fireEvent.click(button);
    const renderPropElement = getByTestId(testPropID);
    expect(renderPropElement).toBeInTheDocument();
  });
});
