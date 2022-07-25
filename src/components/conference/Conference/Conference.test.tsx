import { render, waitFor } from '../../../utils/tests/test-utils';

import Conference from './Conference';

const child = 'child';

const alias = 'conference';
const video = true;
const audio = true;

const createConference = jest.fn();
const joinConference = jest.fn();

jest.mock('../../../hooks/useConference', () => {
  return jest.fn(() => ({
    ...jest.requireActual('../../../hooks/useConference'),
    createConference,
    joinConference,
  }));
});

describe('Conference component', () => {
  test('Creates and joins conference with given props and renders child component', async () => {
    render(
      <Conference alias={alias} video={video} audio={audio}>
        {child}
      </Conference>,
    );
    await waitFor(() => {
      expect(createConference).toBeCalledWith({
        alias,
      });
      expect(joinConference).toBeCalledWith(undefined, {
        constraints: {
          audio,
          video: video
            ? {
                width: { min: 1024, ideal: 1280, max: 1920 },
                height: { min: 576, ideal: 720, max: 1080 },
              }
            : false,
        },
      });
      const crx = new RegExp(child, 'i');
      expect(crx).not.toBeNull();
    });
  });
});
