import { notificationsMock } from '../../../../__mocks__/Misc';
import { NotificationVariants } from '../../../hooks/types/Notifications';
import { render, act, fireEvent } from '../../../utils/tests/test-utils';
import type { IconComponentName } from '../../ui/Icon/IconComponents';

import Notification, { defaultNotificationConfig } from './Notification';

const testID = 'testID';

const getNotification = (type = 'Success') => ({
  notificationId: 2,
  message: `This is an ${type} notification component`,
  variant: NotificationVariants[type as keyof typeof NotificationVariants],
});

const removeNotificationMock = jest.fn();

jest.mock('../../../hooks/useNotifications', () => {
  return jest.fn(() => ({
    ...jest.requireActual('../../../hooks/useNotifications'),
    notifications: notificationsMock,
    removeNotification: removeNotificationMock,
  }));
});

beforeEach(() => {
  jest.useFakeTimers();
  removeNotificationMock.mockClear();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('__ component', () => {
  test('Passes TestID', () => {
    const { getByTestId } = render(<Notification testID={testID} {...getNotification()} />);
    expect(getByTestId(testID)).not.toBeNull();
  });
  test('Applying classname for small notification', () => {
    const { getByTestId } = render(<Notification testID={testID} {...getNotification()} size="s" />);
    expect(getByTestId(testID)).toHaveClass('small');
  });
  test.each(Object.keys(NotificationVariants))(
    'displays proper predefined configuration for %s notification ',
    (type) => {
      const variant = NotificationVariants[type as keyof typeof NotificationVariants];
      const { getByTestId } = render(<Notification testID={testID} {...getNotification(type)} />);
      expect(getByTestId(`${defaultNotificationConfig[variant].icon}-icon`)).not.toBeNull();
    },
  );
  test.each([2000, 3000, 4000])('should disappear after %i time ', (duration) => {
    const notification = getNotification();
    const { getByTestId } = render(
      <Notification
        testID={testID}
        {...notification}
        message={`Should disappear after ${duration} ms`}
        instanceConfig={{ duration }}
      />,
    );

    act(() => {
      jest.advanceTimersByTime(duration + 600);
    });
    /*
    We have to check for fade class - node is stored in Comms provider
     */
    expect(getByTestId(testID)).toHaveClass('fadeOut');
    expect(removeNotificationMock).toHaveBeenCalledTimes(1);
    expect(removeNotificationMock).toHaveBeenCalledWith(notification.notificationId);
  });
  test('should fadeout while clicking on close button', () => {
    const notification = getNotification();
    const { getByTestId } = render(<Notification testID={testID} {...notification} />);
    const button = getByTestId('remove-button');
    expect(button).not.toBeNull();
    fireEvent.click(button);
    /*
      We need to wait for fadeout handler to call remove action
     */
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(removeNotificationMock).toHaveBeenCalledTimes(1);
  });
  test('overwrites default configuration with instance configuration', () => {
    const notification = getNotification();
    const mockCallback = jest.fn();
    const width = 450;
    const instanceConfig = {
      icon: 'arrowLeft' as IconComponentName,
      duration: 1000,
      width,
    };
    const { getByTestId, rerender, queryByTestId } = render(
      <Notification testID={testID} {...notification} callback={mockCallback} instanceConfig={instanceConfig} />,
    );
    expect(getByTestId(`arrowLeft-icon`)).not.toBeNull();
    expect(getByTestId(testID)).toHaveStyle(`width:${450}px`);
    act(() => {
      jest.advanceTimersByTime(1600);
    });
    expect(getByTestId(testID)).toHaveClass('fadeOut');
    expect(removeNotificationMock).toHaveBeenCalledTimes(1);

    rerender(<Notification {...notification} />);
    expect(queryByTestId(`arrowLeft-icon`)).toBeNull();
    const button = getByTestId('remove-button');
    expect(button).not.toBeNull();
    fireEvent.click(button);
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});
