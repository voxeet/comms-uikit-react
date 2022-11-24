import { setupHook, waitFor } from '../../utils/tests/test-utils';
import useNotifications from '../useNotifications';

const setup = () =>
  setupHook(useNotifications, {
    commsProps: {
      value: { showNotification },
    },
  });

const showNotification = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useNotifications', () => {
  test.each(['Success', 'Error', 'Info', 'Warning'])('show %s notification', async (variant) => {
    const hookValues = setup();
    const message = variant;
    const fullMessage = { instanceConfig: undefined, message, variant: message.toLowerCase() };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    hookValues[`show${variant}Notification`](message);
    await waitFor(() => {
      expect(showNotification).toBeCalledWith(fullMessage);
    });
  });
});
