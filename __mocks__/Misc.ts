import { NotificationVariants } from '../src/hooks/types/Notifications';

export const notificationsMock = [
  {
    id: 1,
    message: 'This is a success toast component and we are trying to see elipsis',
    variant: NotificationVariants.Success,
  },
  {
    id: 2,
    message: 'This is an error toast component',
    variant: NotificationVariants.Info,
  },
  {
    id: 3,
    message: 'This is an error toast component',
    variant: NotificationVariants.Warning,
  },
  {
    id: 4,
    message: 'This is an error toast component',
    variant: NotificationVariants.Error,
  },
];
