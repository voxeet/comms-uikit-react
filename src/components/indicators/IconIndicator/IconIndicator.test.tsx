import { defaultTheme as theme } from '../../../common';

import { render } from '../../../utils/test-utils';

import IconIndicator from './IconIndicator';

const { colors } = theme;

const icon = 'microphone';
const testID = 'testID';
const backgroundColor = 'primary.500';
describe('IconIndicator component', () => {
  test('Passes TestID', () => {
    const { getByTestId } = render(<IconIndicator testID={testID} icon={icon} />);
    expect(getByTestId(testID)).not.toBeNull();
  });
  test('Passes given styles', () => {
    const size = 's';
    const { getByTestId } = render(
      <IconIndicator testID={testID} icon={icon} backgroundColor={backgroundColor} size={size} />,
    );
    const element = getByTestId(testID);
    expect(element).toHaveStyle(`background-color: ${colors.primary[500]}`);
    expect(element).toHaveClass(`size-${size}`);
  });
});
