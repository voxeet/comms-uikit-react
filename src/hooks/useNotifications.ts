import { NotificationVariants } from './types/Notifications';
import type { NotificationBase, UseNotifications } from './types/Notifications';
import useCommsContext from './useCommsContext';

const useNotifications: UseNotifications = () => {
  const { showNotification, removeNotification, notifications } = useCommsContext();

  const showSuccessNotification = (message: string, instanceConfig?: NotificationBase[`instanceConfig`]) => {
    showNotification({ message, variant: NotificationVariants.Success, instanceConfig });
  };
  const showInfoNotification = (message: string, instanceConfig?: NotificationBase[`instanceConfig`]) => {
    showNotification({ message, variant: NotificationVariants.Info, instanceConfig });
  };
  const showWarningNotification = (message: string, instanceConfig?: NotificationBase[`instanceConfig`]) => {
    showNotification({ message, variant: NotificationVariants.Warning, instanceConfig });
  };
  const showErrorNotification = (message: string, instanceConfig?: NotificationBase[`instanceConfig`]) => {
    showNotification({ message, variant: NotificationVariants.Error, instanceConfig });
  };
  const showNeutralNotification = (message: string, instanceConfig?: NotificationBase[`instanceConfig`]) => {
    showNotification({ message, variant: NotificationVariants.Neutral, instanceConfig });
  };

  return {
    showNotification,
    showSuccessNotification,
    showInfoNotification,
    showWarningNotification,
    showErrorNotification,
    showNeutralNotification,
    removeNotification,
    notifications,
    shouldShowNotificationCenter: !!notifications.length,
  };
};

export default useNotifications;
