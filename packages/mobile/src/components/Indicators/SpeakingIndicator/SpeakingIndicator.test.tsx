import { defaultTheme as theme } from '@uikit/common';
import React from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
// import 'jest-canvas-mock';

import { render, mergeStyles } from '../../../utils/test-utils';

import SpeakingIndicator from './SpeakingIndicator';

const { colors } = theme;

const testID = 'testID';
const backgroundColor = 'grey.800';
const iconColor = 'primary.500';

describe('SpeakingIndicator component', () => {
  test('Passes TestID', () => {
    const { getByTestId } = render(<SpeakingIndicator testID={testID} />);
    expect(getByTestId(testID)).not.toBeNull();
  });
  test('Passes given styles', () => {
    const { getByTestId } = render(
      <SpeakingIndicator testID={testID} backgroundColor={backgroundColor} iconColor={iconColor} />,
    );
    const element = getByTestId(testID);
    const styles = mergeStyles(element.props.style);
    expect(styles.backgroundColor).toBe(colors.grey[800]);
    expect(styles.width).not.toBe(24);
  });
});
