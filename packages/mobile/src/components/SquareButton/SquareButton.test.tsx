// eslint-disable-next-line import/no-extraneous-dependencies
import { fireEvent } from '@testing-library/react-native';
import { defaultTheme as theme } from '@uikit/common';
import React from 'react';

import { render } from '../../utils/test-utils';

import SquareButton from './SquareButton';

const icon = 'microphone';
const testID = 'testID';
const backgroundColor = 'grey.800';

const { colors } = theme;

const onPress = () => console.log('Hello');

describe('SquareButton component', () => {
  test('Passes TestID', () => {
    const { getByTestId } = render(<SquareButton testID={testID} icon={icon} onPress={onPress} />);
    expect(getByTestId(testID)).not.toBeNull();
  });
  test('Passes given styles', () => {
    const type = 'rectangular';
    const { getByTestId } = render(
      <SquareButton testID={testID} type={type} backgroundColor={backgroundColor} icon={icon} onPress={onPress} />,
    );
    const element = getByTestId(testID);
    expect(element).toHaveStyle({ width: 72 });
    expect(element).toHaveStyle({ backgroundColor: colors.grey[800] });
    expect(element).toHaveStyle({ height: 48 });
  });
  test('Should method invoke after click', () => {
    const mockOnClick = jest.fn();
    const { getByTestId } = render(<SquareButton testID={testID} icon={icon} onPress={mockOnClick} />);
    const element = getByTestId(testID);
    fireEvent(element, 'click');
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
