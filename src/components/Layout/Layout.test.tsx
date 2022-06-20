import { render } from '../../utils/test-utils';

import Layout from './Layout';

const testID = 'testID';
const customComponent = <span className="say-hello">Hello World</span>;

describe('Layout component', () => {
  test('Passes TestID', () => {
    const { getByTestId } = render(<Layout testID={testID}>Hello World</Layout>);
    expect(getByTestId(testID)).not.toBeNull();
  });
  test('Should render children correctly', () => {
    const { container } = render(<Layout testID={testID}>{customComponent}</Layout>);
    const element = container.getElementsByClassName('say-hello')[0];
    expect(element).toHaveClass(`say-hello`);
    expect(element).toHaveTextContent('Hello World');
  });
});
