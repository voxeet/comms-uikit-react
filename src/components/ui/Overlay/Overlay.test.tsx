// eslint-disable-next-line import/no-extraneous-dependencies
import { fireEvent } from '@testing-library/react';

import { render } from '../../../utils/tests/test-utils';

import Overlay from './Overlay';

const testID = 'testID';
const childrenClickCallback = jest.fn();
const callback = jest.fn();
const testChildren = (
  <button
    type="button"
    data-testid="child"
    style={{ width: 150, height: 150 }}
    onClick={(event) => {
      event.stopPropagation();
      childrenClickCallback();
    }}
  >
    CLICK ME!
  </button>
);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('InfoBar component', () => {
  test('Passes TestID', () => {
    const { getByTestId } = render(<Overlay testID={testID}>{testChildren}</Overlay>);
    expect(getByTestId(testID)).not.toBeNull();
  });
  test('Not display while visible prop is false', () => {
    const { queryByTestId } = render(
      <Overlay testID={testID} visible={false}>
        {testChildren}
      </Overlay>,
    );
    expect(queryByTestId(testID)).toBeNull();
  });
  test('Properly positions within relative element', () => {
    const { getByTestId } = render(
      <Overlay testID={testID} nested>
        {testChildren}
      </Overlay>,
    );
    expect(getByTestId(testID)).toHaveClass('nested');
  });
  test('Invoke callback properly', () => {
    const { getByTestId } = render(
      <Overlay testID={testID} onClick={callback}>
        {testChildren}
      </Overlay>,
    );
    const child = getByTestId('child');
    fireEvent.click(child);
    expect(childrenClickCallback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledTimes(0);
  });
});
