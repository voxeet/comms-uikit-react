import type Conference from '@voxeet/voxeet-web-sdk/types/models/Conference';
import type ConferenceOptions from '@voxeet/voxeet-web-sdk/types/models/ConferenceOptions';
import type { JoinOptions } from '@voxeet/voxeet-web-sdk/types/models/Options';

export type PrevConference = {
  /** Participant name */
  participant: string;
  /** Conference name */
  name: string;
};

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
   * Fetches a conference.
   * @param id - The conference id.
   * @returns the `Conference` object that represents the conference that was fetched.
   */
  fetchConference: (id: string) => Promise<Conference>;

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

  /**
   * The object with simple data of the previously joined conference.
   */
  prevConference: PrevConference | null;
};

export type UseConference = () => Conferencing;
