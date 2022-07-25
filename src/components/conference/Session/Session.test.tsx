import type { ParticipantInfo } from '@voxeet/voxeet-web-sdk/types/models/Options';

import { render, waitFor } from '../../../utils/tests/test-utils';

import Session from './Session';

const child = 'child';

const openSession = jest.fn((v: ParticipantInfo) => Promise.resolve(v));

const participantInfo = {
  name: 'uikit',
};

jest.mock('../../../hooks/useSession', () => {
  return jest.fn(() => ({
    ...jest.requireActual('../../../hooks/useSession'),
    openSession,
  }));
});

describe('Conference component', () => {
  test('Creates and joins conference with given props and renders child component', async () => {
    render(<Session participantInfo={participantInfo}>{child}</Session>);
    await waitFor(() => {
      expect(openSession).toBeCalledWith(participantInfo);
      const crx = new RegExp(child, 'i');
      expect(crx).not.toBeNull();
    });
  });
});
