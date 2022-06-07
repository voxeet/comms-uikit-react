/* eslint-disable no-unused-expressions */
import { defaultTheme as theme } from '@uikit/common';

import { render } from '../../../utils/test-utils';

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

    qualityLevel >= 1
      ? expect(element1).toHaveStyle(`backgroundColor: ${colors.secondary[500]}`)
      : expect(element1).toHaveStyle(`backgroundColor: ${colors.primary[500]}`);
    qualityLevel >= 2
      ? expect(element2).toHaveStyle(`backgroundColor: ${colors.secondary[500]}`)
      : expect(element2).toHaveStyle(`backgroundColor: ${colors.primary[500]}`);
    qualityLevel >= 3
      ? expect(element3).toHaveStyle(`backgroundColor: ${colors.secondary[500]}`)
      : expect(element3).toHaveStyle(`backgroundColor: ${colors.primary[500]}`);
    qualityLevel >= 4
      ? expect(element4).toHaveStyle(`backgroundColor: ${colors.secondary[500]}`)
      : expect(element4).toHaveStyle(`backgroundColor: ${colors.primary[500]}`);
    qualityLevel >= 5
      ? expect(element5).toHaveStyle(`backgroundColor: ${colors.secondary[500]}`)
      : expect(element5).toHaveStyle(`backgroundColor: ${colors.primary[500]}`);
  });
});
