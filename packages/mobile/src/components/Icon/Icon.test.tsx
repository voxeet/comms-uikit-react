import { defaultTheme as theme } from '@uikit/common';
import React from 'react';

import { render } from '../../utils/test-utils';

import Icon, { IconSizes } from './Icon';

const name = 'settings';
const testID = 'testID';
const size = 'small';
const color = 'primary.500';

const { colors } = theme;

describe('Text component', () => {
  test('Passes TestID', () => {
    const { getByTestId } = render(<Icon name={name} testID={testID} />);
    expect(getByTestId(testID)).not.toBeNull();
  });
  test('Passes props', () => {
    const { getByTestId } = render(<Icon name={name} testID={testID} color={color} size={size} />);
    const element = getByTestId(testID);
    expect(element).toHaveProp('fill', colors.primary[500]);
    expect(element).toHaveProp('width', IconSizes[size]);
    expect(element).toHaveProp('height', IconSizes[size]);
  });
});
