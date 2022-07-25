import { defaultTheme as theme } from '../../../common';

import { render } from '../../../utils/tests/test-utils';

import Toast from './Toast';

const testID = 'testID';
const backgroundColor = 'primary.500';
const testContent = <span>Hello World!</span>;

const { colors } = theme;

describe('Toast component', () => {
  test('Passes TestID', () => {
    const { getByTestId } = render(
      <Toast testID={testID} backgroundColor={backgroundColor}>
        {testContent}
      </Toast>,
    );
    expect(getByTestId(testID)).not.toBeNull();
  });
  test('Passes given styles', () => {
    const { getByTestId } = render(
      <Toast testID={testID} backgroundColor={backgroundColor}>
        {testContent}
      </Toast>,
    );
    const element = getByTestId(testID);
    expect(element).toHaveClass(`toast`);
    expect(element).toHaveStyle(`background-color: ${colors.primary[500]}`);
  });
});
