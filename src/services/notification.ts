import VoxeetSDK from '@voxeet/voxeet-web-sdk';
import type {
  SubscribeInvitation,
  SubscribeConferenceCreated,
  SubscribeConferenceEnded,
  SubscribeParticipantJoined,
  SubscribeParticipantLeft,
  SubscribeActiveParticipants,
  BaseSubscription,
} from '@voxeet/voxeet-web-sdk/types/models/Notifications';

// These types are so that the user doesn't have to import the SubscriptionType type when creating a subscription
type ReplaceType<T, U extends string> = Omit<T, 'type'> & { type: U };
export type Subscription =
  | ReplaceType<SubscribeInvitation, 'Invitation'>
  | ReplaceType<SubscribeConferenceCreated, 'Conference.Created'>
  | ReplaceType<SubscribeConferenceEnded, 'Conference.Ended'>
  | ReplaceType<SubscribeParticipantJoined, 'Participant.Joined'>
  | ReplaceType<SubscribeParticipantLeft, 'Participant.Left'>
  | ReplaceType<SubscribeActiveParticipants, 'Conference.ActiveParticipants'>;

const SUBSCRIPTION_TO_EVENT_NAME = {
  Invitation: 'invitation',
  'Conference.Created': 'conferenceCreated',
  'Conference.Ended': 'conferenceEnded',
  'Participant.Joined': 'participantJoined',
  'Participant.Left': 'participantLeft',
  'Conference.ActiveParticipants': 'activeParticipants',
} as const;

export default class NotificationService {
  public static subscribe(subscription: Subscription, handler: (...args: unknown[]) => void) {
    const eventName = SUBSCRIPTION_TO_EVENT_NAME[subscription.type];
    VoxeetSDK.notification.subscribe([subscription as BaseSubscription]);
    VoxeetSDK.notification.on(eventName, handler);
    return () => {
      VoxeetSDK.notification.removeListener(eventName, handler);
      VoxeetSDK.notification.unsubscribe([subscription as BaseSubscription]);
    };
  }
}
