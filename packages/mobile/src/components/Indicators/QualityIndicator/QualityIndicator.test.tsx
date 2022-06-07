import { defaultTheme as theme } from '@uikit/common';
import React from 'react';

import { render, mergeStyles } from '../../../utils/test-utils';

import QualityIndicator from './QualityIndicator';

const { colors } = theme;

const testID = 'testID';
const qualityLevel = 2;
const backgroundColor = 'grey.800';
const primaryColor = 'primary.500';
const secondaryColor = 'secondary.500';

describe('QualityIndicator component', () => {
  test('Passes TestID', () => {
    const { getByTestId } = render(<QualityIndicator testID={testID} qualityLevel={qualityLevel} />);
    expect(getByTestId(testID)).not.toBeNull();
  });
  test('Should color lines depending on quality', () => {
    const { getByTestId } = render(
      <QualityIndicator
        testID={testID}
        qualityLevel={qualityLevel}
        backgroundColor={backgroundColor}
        activeColor={primaryColor}
        defaultColor={secondaryColor}
      />,
    );
    const element1 = getByTestId('lineFirst');
    const element2 = getByTestId('lineSecond');
    const element3 = getByTestId('lineThird');
    const element4 = getByTestId('lineFourth');
    const element5 = getByTestId('lineFifth');
    const styles1 = mergeStyles(element1.props.style);
    const styles2 = mergeStyles(element2.props.style);
    const styles3 = mergeStyles(element3.props.style);
    const styles4 = mergeStyles(element4.props.style);
    const styles5 = mergeStyles(element5.props.style);
    expect(styles1.backgroundColor).toBe(qualityLevel >= 1 ? colors.secondary[500] : colors.primary[500]);
    expect(styles2.backgroundColor).toBe(qualityLevel >= 2 ? colors.secondary[500] : colors.primary[500]);
    expect(styles3.backgroundColor).toBe(qualityLevel >= 3 ? colors.secondary[500] : colors.primary[500]);
    expect(styles4.backgroundColor).toBe(qualityLevel >= 4 ? colors.secondary[500] : colors.primary[500]);
    expect(styles5.backgroundColor).toBe(qualityLevel >= 5 ? colors.secondary[500] : colors.primary[500]);
  });
});
