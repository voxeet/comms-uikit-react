import theme from '../../../theme/defaultTheme';
import { render } from '../../../utils/tests/test-utils';

import Spinner from './Spinner';

const testID = 'testID';
const textTestID = 'SpinnerText';
const dotTestID = 'dots';
const spinnerColor = 'secondary.500';
const textContent = 'Hello World';
const textContentColor = 'grey.100';

const { colors } = theme;

describe('Spinner component', () => {
  test('Passes TestID', () => {
    const { getByTestId } = render(<Spinner testID={testID} />);
    expect(getByTestId(testID)).not.toBeNull();
  });
  test('Passes given styles without props', () => {
    const { getByTestId } = render(<Spinner testID={testID} />);
    const dotsElement = getByTestId(dotTestID);
    expect(dotsElement).toHaveAttribute('fill', colors.primary[400]);
  });
  test('Passes given styles with props', () => {
    const { getByTestId } = render(
      <Spinner
        testID={testID}
        spinnerColor={spinnerColor}
        textContent={textContent}
        textContentColor={textContentColor}
      />,
    );
    const dotsElement = getByTestId(dotTestID);
    const textElement = getByTestId(textTestID);
    expect(dotsElement).toHaveAttribute('fill', colors.secondary[500]);
    expect(textElement).toHaveTextContent(`Hello World`);
    expect(textElement).toHaveStyle(`color: ${colors.grey[100]}`);
  });
});
