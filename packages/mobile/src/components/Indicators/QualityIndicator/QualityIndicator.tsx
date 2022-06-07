import type { ColorKey } from '@uikit/common';
import React from 'react';
import { View } from 'react-native';

import useTheme from '../../../hooks/useTheme';

import styles from './QualityIndicator.style';

type QualityLevel = -1 | 1 | 2 | 3 | 4 | 5;

type QualityIndicatorProps = {
  qualityLevel: QualityLevel;
  backgroundColor?: ColorKey;
  primaryColor?: ColorKey;
  secondaryColor?: ColorKey;
  testID?: string;
};

const QualityIndicator = ({
  qualityLevel,
  backgroundColor,
  primaryColor,
  secondaryColor,
  testID,
}: QualityIndicatorProps) => {
  const { colors, getColor } = useTheme();

  const handleLineFillColor = (level: QualityLevel) => {
    let fill = getColor(primaryColor, colors.grey[600]);
    if (qualityLevel >= level) fill = getColor(secondaryColor, colors.white);

    return fill;
  };

  return (
    <View
      testID={testID}
      style={[styles.quality, { backgroundColor: getColor(backgroundColor, colors.whiteAlpha[500]) }]}
    >
      <View testID="lineFirst" style={[styles.line, styles.first, { backgroundColor: handleLineFillColor(1) }]} />
      <View testID="lineSecond" style={[styles.line, styles.second, { backgroundColor: handleLineFillColor(2) }]} />
      <View testID="lineThird" style={[styles.line, styles.third, { backgroundColor: handleLineFillColor(3) }]} />
      <View testID="lineFourth" style={[styles.line, styles.fourth, { backgroundColor: handleLineFillColor(4) }]} />
      <View testID="lineFifth" style={[styles.line, styles.fifth, { backgroundColor: handleLineFillColor(5) }]} />
    </View>
  );
};

export default QualityIndicator;
