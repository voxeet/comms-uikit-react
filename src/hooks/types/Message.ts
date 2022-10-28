import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';

export type Message = {
  /**
   * Received message.
   */
  message: string | null;

  /**
   * The object of participant which sent the message.
   */
  sender: Participant | null;

  /**
   * Sends message to all participants.
   * @param message - The message.
   */
  sendMessage: (message: string) => Promise<void>;

  /**
   * Clear received message data.
   */
  clearMessage: () => void;
};

export type UseMessage = () => Message;
