import { render, fireEvent } from '../../../../utils/tests/test-utils';

import DefaultFallback from './DefaultFallback';

const resetScreenSharingData = jest.fn();
const stopScreenShare = jest.fn();
const startScreenShare = jest.fn();
let stream: MediaStream | null = null;

jest.mock('../../../../hooks/useScreenSharing', () => {
  return jest.fn(() => ({
    ...jest.requireActual('../../../../hooks/useScreenSharing'),
    resetScreenSharingData,
    stopScreenShare,
    startScreenShare,
    stream,
  }));
});

const props = {
  testID: 'testID',
  messageText: 'messageText',
  buttonText: 'buttonText',
};

beforeEach(() => {
  stream = null;
  jest.clearAllMocks();
});

describe('DefaultFallback component', () => {
  test('Passes TestID', () => {
    const { getByTestId } = render(<DefaultFallback {...props} />);
    expect(getByTestId(props.testID)).not.toBeNull();
  });
  test('Should invoke proper action depends on stream presence', async () => {
    const { getAllByRole } = render(<DefaultFallback {...props} />);
    const button = getAllByRole('button')[0];
    fireEvent.click(button);
    expect(resetScreenSharingData).toBeCalledTimes(1);
  });
  test('Should invoke proper action depends on stream absence', async () => {
    stream = new MediaStream();
    const { getAllByRole } = render(<DefaultFallback {...props} />);
    const button = getAllByRole('button')[0];
    fireEvent.click(button);
    expect(stopScreenShare).toBeCalledTimes(1);
  });
  test('Should invoke main action button callback', async () => {
    stream = new MediaStream();
    const { getByText } = render(<DefaultFallback {...props} />);
    const button = getByText(props.buttonText);
    fireEvent.click(button);
    expect(startScreenShare).toBeCalledTimes(1);
  });
  test('Should provide proper labels', () => {
    const { getByText } = render(<DefaultFallback {...props} />);
    expect(getByText(props.messageText)).toBeInTheDocument();
    expect(getByText(props.buttonText)).toBeInTheDocument();
  });
});
