import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';

export type Message = {
  /**
   * Received message.
   */
  message: Record<string, unknown> | null;

  /**
   * The object of participant which sent the message.
   */
  sender: Participant | null;

  /**
   * Sends message to all participants.
   * @param message - The message.
   */
  sendMessage: (message: Record<string, unknown>) => Promise<void>;

  /**
   * Clear received message data.
   */
  clearMessage: () => void;
};

export type UseMessage = () => Message;
