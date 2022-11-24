import { render, screen, fireEvent } from '../../../utils/tests/test-utils';

import Tooltip from './Tooltip';

const testID = 'testID';
const text = 'TEST';
const buttonTestID = 'button';

const child = (
  <button type="button" data-testid={buttonTestID}>
    CLICK ME
  </button>
);

describe('Tooltip', () => {
  test('Should pass testID', () => {
    render(
      <Tooltip text={text} testID={testID}>
        {child}
      </Tooltip>,
    );
    expect(screen.getByTestId(testID)).toBeInTheDocument();
  });
  test('Should not be visible', () => {
    render(
      <Tooltip text={text} testID={testID}>
        {child}
      </Tooltip>,
    );
    expect(screen.getByTestId(testID)).toHaveClass('hidden');
  });
  test('Should be visible on hover', () => {
    render(
      <Tooltip text={text} testID={testID}>
        {child}
      </Tooltip>,
    );
    expect(screen.getByTestId(buttonTestID)).toBeVisible();
    fireEvent.mouseOver(screen.getByTestId(buttonTestID));
    expect(screen.getByTestId(testID)).toHaveClass('tooltip');
  });
});
