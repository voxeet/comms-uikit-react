import theme from '../../../theme/defaultTheme';
import { render } from '../../../utils/tests/test-utils';

import Space from './Space';

const testID = 'testID';
const marginTop = 'l';
const marginVertical = 's';
const customComponent = <span className="say-hello">Hello World</span>;

const { spaces } = theme;

describe('Space component', () => {
  test('Passes TestID', () => {
    const { getByTestId } = render(<Space testID={testID}>Hello World</Space>);
    expect(getByTestId(testID)).not.toBeNull();
  });
  test('Should render children correctly and has margins', () => {
    const { container } = render(
      <Space mt={marginTop} mv={marginVertical} testID={testID}>
        {customComponent}
      </Space>,
    );
    const element = container.getElementsByClassName('say-hello')[0];
    expect(element).toHaveClass(`say-hello`);
    expect(element).toHaveTextContent('Hello World');
    expect(container).toHaveStyle(`marginTop: ${spaces[marginTop]}`);
    expect(container).toHaveStyle(`marginBottom: ${spaces[marginVertical]}`);
  });
});
