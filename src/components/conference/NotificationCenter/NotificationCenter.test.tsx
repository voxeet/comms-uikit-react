import { notificationsMock } from '../../../../__mocks__/Misc';
import type { Notification } from '../../../hooks/types/Notifications';
import { render, act } from '../../../utils/tests/test-utils';

import type { NotificationPositions } from './NotificationCenter';
import NotificationCenter from './NotificationCenter';

const testID = 'testID';

let testNotifications: Notification[];

beforeEach(() => {
  jest.useFakeTimers();
  testNotifications = [...notificationsMock];
  jest.clearAllMocks();
});
afterEach(() => {
  jest.useRealTimers();
});

const removeNotificationMock = jest.fn((id: number) => {
  const index = testNotifications.findIndex((n) => n.id === id);
  testNotifications.splice(index, 1);
});

jest.mock('../../../hooks/useNotifications', () => {
  return jest.fn(() => ({
    ...jest.requireActual('../../../hooks/useNotifications'),
    notifications: testNotifications,
    shouldShowNotificationCenter: !!testNotifications.length,
    removeNotification: removeNotificationMock,
  }));
});

// Show new notification in NotificationCenter
const addNotificationToList = () => {
  testNotifications.unshift({
    ...notificationsMock[Math.floor(Math.random() * notificationsMock.length)],
    id: Date.now() * Math.random(),
  });
};

describe('NotificationCenter component', () => {
  test('Passes TestID', async () => {
    const { getByTestId } = render(<NotificationCenter position="bottom-center" testID={testID} />);
    expect(await getByTestId(testID)).not.toBeNull();
  });
  test('Renders list of notifications', async () => {
    const { getByTestId, getAllByTestId } = render(<NotificationCenter position="bottom-center" testID={testID} />);
    expect(await getByTestId(testID)).not.toBeNull();
    const elementsArray = getAllByTestId('Notification');
    expect(elementsArray).toHaveLength(testNotifications.length);
  });
  test(`Doesn't render while there are no notifications`, async () => {
    testNotifications = [];
    const { queryByTestId } = render(<NotificationCenter testID={testID} />);
    expect(await queryByTestId(testID)).toBeNull();
  });
  test('Changes length while adding / removing notification', async () => {
    testNotifications = [];

    const { queryByTestId, getAllByTestId, rerender } = render(<NotificationCenter testID={testID} />);
    expect(await queryByTestId(testID)).toBeNull();
    addNotificationToList();
    rerender(<NotificationCenter testID={testID} />);
    addNotificationToList();
    rerender(<NotificationCenter testID={testID} />);
    expect(await queryByTestId(testID)).not.toBeNull();
    const elementsArray = getAllByTestId('Notification');
    expect(elementsArray).toHaveLength(testNotifications.length);
  });

  test.each(['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'])(
    'properly position itself in %s',
    async (position) => {
      const { queryByTestId } = render(
        <NotificationCenter testID={testID} position={position as NotificationPositions} />,
      );
      expect(await queryByTestId(testID)).toHaveClass(position);
    },
  );

  test.each([1000, 2000, 3000])('Disappear after %n ms', async (duration) => {
    jest.useFakeTimers();
    const { queryByTestId, rerender } = render(<NotificationCenter testID={testID} duration={duration} />);
    expect(await queryByTestId(testID)).not.toBeNull();

    act(() => {
      jest.advanceTimersByTime(duration + 1000);
    });
    rerender(<NotificationCenter testID={testID} duration={duration} />);
    expect(await queryByTestId(testID)).toBeNull();
    expect(testNotifications.length).toBe(0);
  });
});
