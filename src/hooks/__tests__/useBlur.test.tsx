import { setupHook } from '../../utils/tests/test-utils';
import useBlur from '../useBlur';

const isBlurred = false;
const startBackgroundBlur = jest.fn();
const stopVideoProcessing = jest.fn();

const setup = () => {
  return setupHook(useBlur, {
    commsProps: {
      value: { isBlurred, startBackgroundBlur, stopVideoProcessing },
    },
  });
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useBlur', () => {
  test('consumes context data', () => {
    const hookValues = setup();
    expect(hookValues.isBlurred).toEqual(isBlurred);
    expect(hookValues.startBackgroundBlur).toEqual(startBackgroundBlur);
    expect(hookValues.stopVideoProcessing).toEqual(stopVideoProcessing);
  });
});
