/* eslint-disable global-require */
import type { ColorKey } from '@uikit/common';
import LottieView from 'lottie-react-native';
import React from 'react';
import { View } from 'react-native';

import useTheme from '../../../hooks/useTheme';

import styles from './SpeakingIndicator.style';

type SpeakingIndicatorProps = {
  backgroundColor?: ColorKey;
  // TODO - add gradient
  iconColor?: ColorKey;
  size?: 'small' | 'medium';
  testID?: string;
};

const SpeakingIndicator = ({ backgroundColor, iconColor, size = 'medium', testID }: SpeakingIndicatorProps) => {
  const { colors, getColor } = useTheme();
  return (
    <View
      testID={testID}
      style={[
        styles.indicator,
        size === 'small' && styles.small,
        { backgroundColor: getColor(backgroundColor, colors.whiteAlpha[500]) },
      ]}
    >
      <LottieView
        source={require('@uikit/common/src/assets/lottie/soundWaveLottie.json')}
        colorFilters={[
          {
            keypath: 'Layer 1 Outlines',
            color: getColor(iconColor, colors.white),
          },
          {
            keypath: 'Layer 2 Outlines',
            color: getColor(iconColor, colors.white),
          },
          {
            keypath: 'Layer 3 Outlines',
            color: getColor(iconColor, colors.white),
          },
          {
            keypath: 'Layer 4 Outlines',
            color: getColor(iconColor, colors.white),
          },
        ]}
        autoPlay
        loop
        style={[styles.soundWave, size === 'small' && styles.soundWaveSmall]}
      />
    </View>
  );
};

export default SpeakingIndicator;
