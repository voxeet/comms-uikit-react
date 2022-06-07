import { defaultTheme as theme } from '@uikit/common';
import React from 'react';

import { render, mergeStyles } from '../../../utils/test-utils';

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
    const size = 'small';
    const expectedWidth = 24;
    const { getByTestId } = render(
      <IconIndicator testID={testID} backgroundColor={backgroundColor} icon={icon} size={size} />,
    );
    const element = getByTestId(testID);
    const styles = mergeStyles(element.props.style);
    expect(styles.backgroundColor).toBe(colors.primary[500]);
    expect(styles.width).toBe(expectedWidth);
  });
});
