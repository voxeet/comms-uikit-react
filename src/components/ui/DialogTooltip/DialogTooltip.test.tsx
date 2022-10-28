import Color from 'color';

import defaultTheme from '../../../theme/defaultTheme';
import { render } from '../../../utils/tests/test-utils';

import DialogTooltip from './DialogTooltip';
import type { Position } from './DialogTooltip';

const testID = 'testID';
const testIDChild = 'testIDChild';

let isVisible: boolean;
const children = <div data-testid={testIDChild} />;

beforeEach(() => {
  isVisible = true;
});

describe('DialogTooltip component', () => {
  test('Passes TestID', () => {
    const { getByTestId } = render(<DialogTooltip testID={testID} isVisible={isVisible} />);
    expect(getByTestId(testID)).not.toBeNull();
  });
  test('Not displaying while isVisible is not truthy', () => {
    isVisible = false;
    const { queryByTestId } = render(<DialogTooltip testID={testID} isVisible={isVisible} />);
    const element = queryByTestId(testID);
    expect(element).toBeNull();
  });
  test('Display children', () => {
    isVisible = true;
    const { getByTestId } = render(
      <DialogTooltip testID={testID} isVisible={isVisible}>
        {children}
      </DialogTooltip>,
    );
    expect(getByTestId(testIDChild)).toBeInTheDocument();
  });
  test.each(['top', 'bottom'])(`Renders proper %s position`, (position) => {
    const { getByTestId } = render(
      <DialogTooltip testID={testID} isVisible={isVisible} position={position as Position} />,
    );
    expect(getByTestId(testID)).toHaveClass(position);
  });
  test.each(['infoWarning', 'infoError', 'background'])(`Renders proper %s background color`, (color) => {
    const { getByTestId } = render(<DialogTooltip testID={testID} isVisible={isVisible} backgroundColor={color} />);
    const { colors } = defaultTheme;
    const rgbColor = Color.rgb(colors[color as keyof typeof colors]);

    expect(getByTestId(testID)).toHaveStyle(`background-color: ${rgbColor}`);
  });
});
