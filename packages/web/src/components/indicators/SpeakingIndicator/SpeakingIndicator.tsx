/* eslint-disable react/jsx-props-no-spreading */
import type { ColorKey, Sizes } from '@uikit/common';
import soundWave from '@uikit/common/src/assets/lottie/soundWaveLottie.json';
import cx from 'classnames';
import { colorify } from 'lottie-colorify';
import React from 'react';
import Lottie from 'react-lottie';

import useTheme from '../../../hooks/useTheme';

import styles from './SpeakingIndicator.module.scss';

type SpeakingIndicatorProps = React.HTMLAttributes<HTMLDivElement> & {
  backgroundColor?: ColorKey;
  iconColor?: ColorKey;
  size?: Extract<Sizes, 's' | 'm'>;
  testID?: string;
};

const SpeakingIndicator = ({ backgroundColor, iconColor, size = 'm', testID, ...props }: SpeakingIndicatorProps) => {
  const { colors, getColor } = useTheme();

  const fillColor = getColor(iconColor, colors.white);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: colorify([fillColor, fillColor, fillColor, fillColor], soundWave),
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div
      data-testid={testID}
      className={cx(styles.indicator, styles[`size-${size}`])}
      style={{ backgroundColor: getColor(backgroundColor, colors.whiteAlpha[500]) }}
      {...props}
    >
      <Lottie options={defaultOptions} width={size === 's' ? 30 : 40} height={size === 's' ? 30 : 40} />
    </div>
  );
};

export default React.memo(SpeakingIndicator);
