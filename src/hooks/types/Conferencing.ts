import type Conference from '@voxeet/voxeet-web-sdk/types/models/Conference';
import type ConferenceOptions from '@voxeet/voxeet-web-sdk/types/models/ConferenceOptions';
import type { JoinOptions } from '@voxeet/voxeet-web-sdk/types/models/Options';
import type { VideoForwardingOptions } from '@voxeet/voxeet-web-sdk/types/models/VideoForwarding';

export type PrevConference = {
  /** Participant name */
  participant: string;
  /** Conference name */
  name: string;
};

export enum VideoForwardingStrategy {
  /**
   * Selects participants based on their audio volume. This allows the local participant to receive video streams only from active speakers.
   */
  LastSpeaker = 'lastSpeakerStrategy',
  /**
   * Selects participants based on their distance from the local participant. This allows the local participant to receive video streams only from the nearest participants. This strategy is available only to participants who enabled spatial audio.
   */
  ClosestUser = 'closestUserStrategy',
}

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

  /**
   * Maximum video tracks forwarding. Denominates how many video tracks local user will receive
   */

  maxVideoForwarding: number;
  /**
   * @param maxTiles - number of tiles to receive , this number doesn't include local participant
   * @param options - additional options to set specific user and forwarding strategy
   */
  setVideoForwarding: (maxVideoForwarding: number, options?: Partial<VideoForwardingOptions>) => Promise<void>;
};

export type UseConference = () => Conferencing;
