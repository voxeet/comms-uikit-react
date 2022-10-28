import { Status as ShareStatus } from '../../../hooks/types/misc';
import defaultTheme from '../../../theme/defaultTheme';
import { render, fireEvent } from '../../../utils/tests/test-utils';

import ScreenSharingActionBar from './ScreenSharingActionBar';

const testID = 'ScreenSharingActionBar';
const props = {
  testID,
  buttonLabels: { tooltip: 'tooltip', label: 'ButtonLabel' },
  statusLabels: { active: 'active label', error: 'error label', loading: 'loading label', other: 'other label' },
  guestLabel: 'guestLabel',
};

let mockStatus = ShareStatus.Active;
let localId = '1234';
const guestId = '1234';

const statusesArray = [ShareStatus.Active, ShareStatus.Error, ShareStatus.Loading, ShareStatus.Other];
const actionCallbackMock = jest.fn();
jest.mock('../../../hooks/useScreenSharing', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    ...jest.requireActual('../../../hooks/useScreenSharing'),
    stopScreenShare: actionCallbackMock,
    status: mockStatus,
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
  localId = '1234';
  mockStatus = ShareStatus.Active;
});

describe('ShareActionBar` component', () => {
  test.each(statusesArray)('renders proper values for local user for %s status', (status) => {
    mockStatus = status;

    const { queryByTestId, getByText } = render(<ScreenSharingActionBar {...props} />);
    if (status === 'error') {
      expect(getByText(props.statusLabels[status])).toBeVisible();
      expect(queryByTestId('StatusDot')).toHaveStyle(`background-image: ${defaultTheme.colors.infoWarning}`);
    }
    if (status === 'loading') {
      expect(getByText(props.statusLabels[status])).toBeVisible();
      expect(queryByTestId('StatusDot')).toHaveStyle(`background-image: ${defaultTheme.colors.transparent}`);
      const button = getByText('ButtonLabel');
      fireEvent.click(button);
      expect(actionCallbackMock).toHaveBeenCalledTimes(1);
    }
    if (status === 'active') {
      expect(queryByTestId('StatusDot')).toHaveStyle(`background-image: ${defaultTheme.colors.infoSuccess}`);
      expect(queryByTestId('ActionBarButton')).toBeVisible();
      expect(getByText(props.statusLabels[status])).toBeVisible();
      const button = getByText('ButtonLabel');
      fireEvent.click(button);
      expect(actionCallbackMock).toHaveBeenCalledTimes(1);
    }
  });

  test.each(statusesArray)('renders proper values for guest user for %s status', async (status) => {
    localId = '4321';
    mockStatus = status as ShareStatus;

    const { queryByTestId, queryByText } = render(<ScreenSharingActionBar {...props} />);
    if (status === 'error' || status === 'loading') {
      expect(queryByTestId(props.testID)).not.toBeInTheDocument();
    }
    if (status === 'active') {
      expect(queryByTestId(props.testID)).toBeVisible();
      expect(queryByText(props.guestLabel)).toBeVisible();
    }
  });
  test('should not render buttons  while compact prop is provided', () => {
    const { queryAllByRole } = render(<ScreenSharingActionBar compact {...props} />);
    expect(queryAllByRole('button')).toHaveLength(0);
  });
});
