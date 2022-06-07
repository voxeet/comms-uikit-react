import { defaultTheme as theme } from '@uikit/common';

// eslint-disable-next-line import/no-extraneous-dependencies
import 'jest-canvas-mock';

import { render } from '../../../utils/test-utils';

import SpeakingIndicator from './SpeakingIndicator';

const { colors } = theme;

const testID = 'testID';
const backgroundColor = 'grey.800';
const iconColor = 'primary.500';
const size = 's';

describe('SpeakingIndicator component', () => {
  test('Passes TestID', () => {
    const { getByTestId } = render(<SpeakingIndicator testID={testID} />);
    expect(getByTestId(testID)).not.toBeNull();
  });
  test('Passes given styles', () => {
    const { getByTestId } = render(
      <SpeakingIndicator testID={testID} backgroundColor={backgroundColor} iconColor={iconColor} size={size} />,
    );
    const element = getByTestId(testID);
    expect(element).toHaveStyle(`background-color: ${colors.grey[800]}`);
    expect(element).toHaveClass(`size-${size}`);
  });
});
