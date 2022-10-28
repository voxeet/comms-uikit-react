import { Status } from '../../../hooks/types/misc';
import defaultTheme from '../../../theme/defaultTheme';
import { render, fireEvent, waitFor } from '../../../utils/tests/test-utils';

import RecordingActionBar from './RecordingActionBar';

const actionCallbackMock = jest.fn();
const stopActionMock = jest.fn(() => Promise.resolve(true));
const startActionMock = jest.fn(() => Promise.resolve(true));
const testID = 'RecordingActionBar';
const props = {
  onActionSuccess: actionCallbackMock,
  testID,
  buttonLabels: {
    active: { tooltip: 'tooltip', label: 'ButtonLabel' },
    error: { tooltip: 'tooltip', label: 'TryAgain' },
  },
  statusLabels: { active: 'active label', error: 'error label', loading: 'loading label', other: 'other label' },
  guestLabel: 'guestLabel',
};

let mockStatus = Status.Active;
let localId = 1234;
const guestId = 1234;

const statusesArray = [Status.Active, Status.Error, Status.Loading, Status.Other];
jest.mock('../../../hooks/useRecording', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    ...jest.requireActual('../../../hooks/useRecording'),
    stopRecording: stopActionMock,
    startRecording: startActionMock,
    status: mockStatus,
    isLocalUserRecordingOwner: localId === guestId,
    owner: {
      id: localId,
      info: {
        name: 'TestName',
      },
    },
  })),
}));

jest.mock('../../../hooks/useParticipants', () =>
  jest.fn(() => ({
    participant: { id: guestId },
  })),
);

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  localId = 1234;
  mockStatus = Status.Active;
});

describe('RecordingBar` component', () => {
  test.each(statusesArray)('renders proper values for local user for %s status', async (status) => {
    mockStatus = status;

    const { getByText, queryByTestId, debug, getByTestId } = render(<RecordingActionBar {...props} />);
    if (status === 'error') {
      expect(getByText(props.statusLabels[status])).toBeVisible();
      expect(queryByTestId('StatusDot')).toHaveStyle(`background-image: ${defaultTheme.colors.infoWarning}`);
      expect(getByTestId('ActionBarClose')).toBeInTheDocument();
      expect(getByText(props.buttonLabels.error.label)).toBeVisible();
      const tryAgainButton = getByText(props.buttonLabels.error.label);
      fireEvent.click(tryAgainButton);
      expect(startActionMock).toHaveBeenCalledTimes(1);
      await waitFor(() => expect(actionCallbackMock).toHaveBeenCalledTimes(1));
    }
    if (status === 'loading') {
      expect(getByText(props.statusLabels[status])).toBeVisible();
      expect(queryByTestId('StatusDot')).toHaveStyle(`background-image: ${defaultTheme.colors.transparent}`);
    }
    if (status === 'active') {
      debug();
      expect(queryByTestId('StatusDot')).toHaveStyle(`background-image: ${defaultTheme.colors.infoError}`);
      expect(getByText(props.statusLabels[status])).toBeVisible();
      const stopButton = getByText(props.buttonLabels.active.label);
      fireEvent.click(stopButton);
      expect(stopActionMock).toHaveBeenCalledTimes(1);
      await waitFor(() => expect(actionCallbackMock).toHaveBeenCalledTimes(1));
    }
    if (status === 'other') {
      expect(queryByTestId(testID)).toBeNull();
    }
  });

  test.each(statusesArray)('renders proper values for guest user for %s status', async (status) => {
    localId = 4321;
    mockStatus = status as Status;

    const { queryByTestId, queryAllByRole } = render(<RecordingActionBar {...props} />);

    if (status === 'active') {
      expect(queryByTestId(props.testID)).toBeVisible();
      expect(queryAllByRole('button')).toHaveLength(0);
    } else {
      expect(queryByTestId(props.testID)).toBeNull();
    }
  });

  test('should not render buttons  while compact prop is provided', () => {
    const { queryAllByRole, getByTestId } = render(<RecordingActionBar compact {...props} />);
    expect(queryAllByRole('button')).toHaveLength(0);
    expect(getByTestId(testID)).toHaveClass('compact');
  });
});
