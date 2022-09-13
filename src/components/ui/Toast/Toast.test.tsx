import { render, act, screen, waitFor } from '../../../utils/tests/test-utils';

import Toast from './Toast';

const testID = 'testID';
const testContent = <span>Hello World!</span>;

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});
describe('Toast component', () => {
  test('Passes TestID', () => {
    const { getByTestId } = render(
      <Toast testID={testID} iconName="camera" text="test">
        {testContent}
      </Toast>,
    );
    expect(getByTestId(testID)).not.toBeNull();
  });
  test('Passes given styles', () => {
    const { getByTestId } = render(
      <Toast testID={testID} iconName="camera" text="test">
        {testContent}
      </Toast>,
    );
    const element = getByTestId(testID);
    expect(element).toHaveClass(`toast`);
  });
  test('Disappears after set duration ', async () => {
    const duration = 4000;
    const text = 'TEST';
    render(
      <Toast testID={testID} iconName="camera" text={text} duration={duration}>
        {testContent}
      </Toast>,
    );

    expect(screen.getByTestId(testID)).not.toHaveClass(`invisible`);
    act(() => {
      jest.advanceTimersByTime(duration);
    });

    await waitFor(
      () => {
        expect(screen.getByTestId(testID)).toHaveClass(`invisible`);
      },
      { timeout: duration },
    );
  });
});
