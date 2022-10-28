import theme from '../../../theme/defaultTheme';
import { render } from '../../../utils/tests/test-utils';

import Pill from './Pill';

const text = 'pill';
const testID = 'testID';

const { colors } = theme;

describe('Pill component', () => {
  test('Passes TestID', () => {
    const { getByTestId } = render(<Pill testID={testID} text={text} />);
    expect(getByTestId(testID)).not.toBeNull();
  });
  test('Passes text', () => {
    const { getByText } = render(<Pill testID={testID} text={text} />);
    const regEx = new RegExp(text, 'i');
    expect(getByText(regEx)).not.toBeNull();
  });
  test('Background and text colors are changing on active', () => {
    const { getByTestId, rerender } = render(<Pill testID={testID} text={text} />);
    expect(getByTestId(testID)).toHaveStyle(`background-color: rgba(255, 255, 255, 0.4)`);
    expect(getByTestId(`${testID}-text`)).toHaveStyle(`color: ${colors.white}`);
    rerender(<Pill testID={testID} text={text} active />);
    expect(getByTestId(testID)).toHaveStyle(`background-color: ${colors.white}`);
    expect(getByTestId(`${testID}-text`)).toHaveStyle(`color: ${colors.purple[400]}`);
  });
});
