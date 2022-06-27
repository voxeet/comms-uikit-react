import type Conference from '@voxeet/voxeet-web-sdk/types/models/Conference';
import type ConferenceOptions from '@voxeet/voxeet-web-sdk/types/models/ConferenceOptions';
import type { JoinOptions } from '@voxeet/voxeet-web-sdk/types/models/Options';

export type Conferencing = {
  /**
   * The object of the current conference.
   */
  conference: Conference | null;

  /**
   * Creates a conference.
   * @param options - The conference options.
   * @returns the `Conference` object that represents the conference that was created.
   */
  createConference: (options: ConferenceOptions) => Promise<Conference>;

  /**
   * Joins a conference.
   * @param conference - The conference object.
   * @param options - The additional options for the joining participant.
   * @returns the `Conference` object that represents the conference that was joined.
   */
  joinConference: (conference: Conference, options: JoinOptions) => Promise<Conference>;

  /**
   * Leaves a conference.
   */
  leaveConference: () => Promise<void>;
}

export type UseConference = () => Conferencing;
