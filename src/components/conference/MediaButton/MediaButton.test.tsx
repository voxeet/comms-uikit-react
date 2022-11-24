// eslint-disable-next-line import/no-extraneous-dependencies
import { fireEvent } from '@testing-library/react';

import theme from '../../../theme/defaultTheme';
import { render } from '../../../utils/tests/test-utils';

import MediaButton from './MediaButton';

const testID = 'testID';
const defaultTestIcon = 'microphone';
const activeTestIcon = 'microphoneOff';
const disabledTestIcon = 'microphoneOff';
const customActiveBackgroundColor = 'primary.500';
const customActiveIconColor = 'secondary.500';
const customActiveStrokeColor = 'secondary.500';

const mockOnClick = jest.fn();

const { colors } = theme;

describe('MediaButton component', () => {
  test('Passes TestID', () => {
    const { getByTestId } = render(
      <MediaButton
        testID={testID}
        defaultIcon={defaultTestIcon}
        activeIcon={activeTestIcon}
        disabledIcon={disabledTestIcon}
        onClick={mockOnClick}
        isActive
        isDisabled={false}
      />,
    );
    expect(getByTestId(testID)).not.toBeNull();
  });
  test('Should render with default styles in default state', () => {
    const { getByTestId } = render(
      <MediaButton
        testID={testID}
        defaultIcon={defaultTestIcon}
        activeIcon={activeTestIcon}
        disabledIcon={disabledTestIcon}
        onClick={mockOnClick}
        isActive={false}
        isDisabled={false}
      />,
    );
    const element = getByTestId(testID);
    const iconElement = getByTestId('icon');
    expect(element).toHaveStyle(`background: ${colors.grey[600]}`);
    expect(element).toHaveStyle(`border-color: ${colors.transparent}`);
    expect(iconElement).toHaveAttribute('fill', colors.white);
  });
  test('Should render with custom styles in active state', () => {
    const { getByTestId } = render(
      <MediaButton
        testID={testID}
        defaultIcon={defaultTestIcon}
        activeIcon={activeTestIcon}
        disabledIcon={disabledTestIcon}
        activeBackgroundColor={customActiveBackgroundColor}
        activeIconColor={customActiveIconColor}
        activeStrokeColor={customActiveStrokeColor}
        onClick={mockOnClick}
        isActive
        isDisabled={false}
      />,
    );
    const element = getByTestId(testID);
    const iconElement = getByTestId('icon');
    expect(element).toHaveStyle(`background: ${colors.primary[500]}`);
    expect(element).toHaveStyle(`border-color: ${colors.secondary[500]}`);
    expect(iconElement).toHaveAttribute('fill', colors.secondary[500]);
  });
  test('Should be disabled', () => {
    const { getByTestId } = render(
      <MediaButton
        testID={testID}
        defaultIcon={defaultTestIcon}
        activeIcon={activeTestIcon}
        disabledIcon={disabledTestIcon}
        onClick={mockOnClick}
        isActive={false}
        isDisabled
      />,
    );
    const element = getByTestId(testID);
    expect(element).toBeDisabled();
  });
  test('Should method invoke after click', () => {
    const mockOnClick = jest.fn();
    const { getByTestId } = render(
      <MediaButton
        testID={testID}
        defaultIcon={defaultTestIcon}
        activeIcon={activeTestIcon}
        disabledIcon={disabledTestIcon}
        onClick={mockOnClick}
        isActive
        isDisabled={false}
      />,
    );
    const element = getByTestId(testID);
    fireEvent.click(element);
    expect(mockOnClick).toHaveBeenCalled();
  });
});
