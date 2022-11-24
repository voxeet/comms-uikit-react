import { render, act, screen, waitFor } from '../../../utils/tests/test-utils';

import InfoBar from './InfoBar';

const testID = 'testID';
const testContent = <span>Hello World!</span>;

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});
describe('InfoBar component', () => {
  test('Passes TestID', () => {
    const { getByTestId } = render(
      <InfoBar testID={testID} iconName="camera" text="test">
        {testContent}
      </InfoBar>,
    );
    expect(getByTestId(testID)).not.toBeNull();
  });
  test('Passes given styles', () => {
    const { getByTestId } = render(
      <InfoBar testID={testID} iconName="camera" text="test">
        {testContent}
      </InfoBar>,
    );
    const element = getByTestId(testID);
    expect(element).toHaveClass(`infoBar`);
  });
  test('Disappears after set duration ', async () => {
    const duration = 4000;
    const text = 'TEST';
    render(
      <InfoBar testID={testID} iconName="camera" text={text} duration={duration}>
        {testContent}
      </InfoBar>,
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
  test('Still present while alwaysVisible prop is provided', async () => {
    const text = 'TEST';
    render(
      <InfoBar testID={testID} iconName="camera" text={text} duration={4000} alwaysVisible>
        {testContent}
      </InfoBar>,
    );
    expect(screen.getByTestId(testID)).not.toHaveClass(`invisible`);
    act(() => {
      jest.advanceTimersByTime(6000);
    });
    await waitFor(() => {
      expect(screen.getByText(text)).toBeVisible();
    });
  });
});
