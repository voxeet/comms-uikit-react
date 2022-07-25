/* eslint-disable react/jsx-props-no-spreading */
import type { ColorKey, Sizes } from '../../../../common';
import soundWave from '../../../../common/assets/lottie/soundWaveLottie.json';
import cx from 'classnames';
import { colorify } from 'lottie-colorify';
import Lottie, { AnimationItem } from 'lottie-web';
import React, { useEffect, useRef } from 'react';

import useTheme from '../../../../hooks/useTheme';
import Space from '../../Space/Space';

import styles from './SpeakingIndicator.module.scss';

export type SpeakingIndicatorProps = React.HTMLAttributes<HTMLDivElement> & {
  backgroundColor?: ColorKey;
  iconColor?: ColorKey;
  size?: Extract<Sizes, 's' | 'm'>;
  testID?: string;
};

const SpeakingIndicator = ({ backgroundColor, iconColor, size = 'm', testID, ...props }: SpeakingIndicatorProps) => {
  const { getColor } = useTheme();

  const fillColor = getColor(iconColor, 'white');

  const animation = useRef(null);

  useEffect(() => {
    let instance: AnimationItem | null = null;
    if (animation.current) {
      instance = Lottie.loadAnimation({
        container: animation.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: colorify([fillColor, fillColor, fillColor, fillColor], soundWave),
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice',
        },
      });
    }

    return () => {
      instance?.destroy();
    };
  }, [animation]);

  return (
    <Space
      testID={testID}
      className={cx(styles.indicator, styles[`size-${size}`])}
      style={{ backgroundColor: getColor(backgroundColor, 'whiteAlpha.500') }}
      {...props}
    >
      <div style={{ width: size === 's' ? 30 : 40, height: size === 's' ? 30 : 40 }} ref={animation} />
    </Space>
  );
};

export default React.memo(SpeakingIndicator);
