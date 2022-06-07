import { defaultTheme as theme } from '@uikit/common';

import { render } from '../../utils/test-utils';

import Icon from './Icon';

const name = 'settings';
const testID = 'testID';
const size = 's';
const color = 'primary.500';

const { colors } = theme;

describe('Icon component', () => {
  test('Passes TestID', () => {
    const { getByTestId } = render(<Icon name={name} testID={testID} />);
    expect(getByTestId(testID)).not.toBeNull();
  });
  test('Passes props', () => {
    const { getByTestId } = render(<Icon name={name} testID={testID} color={color} size={size} />);
    const element = getByTestId(testID);
    const iconElement = getByTestId('icon');
    expect(element).toHaveClass(`icon`);
    expect(element).toHaveClass(`size-${size}`);
    expect(iconElement).toHaveAttribute('fill', colors.primary[500]);
  });
});
