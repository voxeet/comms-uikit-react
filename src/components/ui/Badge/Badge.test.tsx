import { render } from '../../../utils/tests/test-utils';

import Badge from './Badge';

const testID = 'testID';
const backgroundColor = 'primary.500';

describe('Badge component', () => {
  test('Passes TestID', () => {
    const { getByTestId } = render(<Badge testID={testID} backgroundColor={backgroundColor} />);
    expect(getByTestId(testID)).not.toBeNull();
  });
  test('Passes given styles without content', () => {
    const { getByTestId } = render(<Badge testID={testID} backgroundColor={backgroundColor} />);
    const element = getByTestId(testID);
    expect(element).toHaveClass(`noContent`);
  });
  test('Passes given styles with content', () => {
    const { getByTestId } = render(<Badge testID={testID} backgroundColor={backgroundColor} content="123" />);
    const element = getByTestId(testID);
    expect(element).not.toHaveClass(`noContent`);
    expect(element).toHaveTextContent(`123`);
  });
});
