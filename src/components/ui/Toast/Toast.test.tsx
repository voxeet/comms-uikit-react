import { render } from '../../../utils/tests/test-utils';

import Toast from './Toast';

const testID = 'testID';
const testContent = <span>Hello World!</span>;

describe('Toast component', () => {
  test('Passes TestID', () => {
    const { getByTestId } = render(
      <Toast testID={testID} iconName="camera" text="test">
        {testContent}
      </Toast>,
    );
    expect(getByTestId(testID)).not.toBeNull();
  });
  test('Passes given styles', () => {
    const { getByTestId } = render(
      <Toast testID={testID} iconName="camera" text="test">
        {testContent}
      </Toast>,
    );
    const element = getByTestId(testID);
    expect(element).toHaveClass(`toast`);
  });
});
