import { defaultTheme as theme } from '../../common';

import { render } from '../../utils/test-utils';

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
    const element = getByTestId(testID);
    const textElement = getByTestId(`${testID}-text`);
    expect(element).toHaveStyle(`background: ${colors.whiteAlpha[500]}`);
    expect(textElement).toHaveStyle(`color: ${colors.white}`);
    rerender(<Pill testID={testID} text={text} active />);
    expect(element).toHaveStyle(`background: ${colors.white}`);
    expect(textElement).toHaveStyle(
      `background: ${`-webkit-linear-gradient(99.69deg,${colors.blue[400]} -10.66%, ${colors.purple[400]} 114.64%)`}`,
    );
  });
  test('Background and text colors are changing on active and use props colors', () => {
    const textColor = {
      default: 'blue',
      active: 'purple',
    };
    const backgroundColor = {
      default: 'red',
      active: 'primary',
    };
    const { getByTestId, rerender } = render(
      <Pill testID={testID} text={text} textColor={textColor} backgroundColor={backgroundColor} />,
    );
    const element = getByTestId(testID);
    const textElement = getByTestId(`${testID}-text`);
    expect(element).toHaveStyle(`background-color: ${colors.red[400]}`);
    expect(textElement).toHaveStyle(`color: ${colors.blue[400]}`);
    rerender(<Pill testID={testID} text={text} textColor={textColor} backgroundColor={backgroundColor} active />);
    expect(element).toHaveStyle(`background-color: ${colors.primary[400]}`);
    expect(textElement).toHaveStyle(`color: ${colors.purple[400]}`);
  });
});
