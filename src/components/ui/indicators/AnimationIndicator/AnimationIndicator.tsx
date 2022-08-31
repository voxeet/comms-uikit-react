/* eslint-disable react/jsx-props-no-spreading */
import type { ColorKey, Sizes } from '../../../../common';
import cx from 'classnames';
import { colorify } from 'lottie-colorify';
import Lottie, { AnimationItem } from 'lottie-web';
import React, { useEffect, useRef } from 'react';

import useTheme from '../../../../hooks/useTheme';
import Space from '../../Space/Space';

import styles from './AnimationIndicator.module.scss';

export type AnimationIndicatorProps = React.HTMLAttributes<HTMLDivElement> & {
  backgroundColor?: ColorKey;
  contentColor?: ColorKey;
  animationData: Record<string, unknown>;
  size?: Extract<Sizes, 's' | 'm'>;
  testID?: string;
};

const AnimationIndicator = ({
  backgroundColor,
  contentColor,
  animationData,
  size = 'm',
  testID,
  ...props
}: AnimationIndicatorProps) => {
  const { getColor } = useTheme();

  const fillColor = getColor(contentColor, 'white');

  const animation = useRef(null);

  useEffect(() => {
    let instance: AnimationItem | null = null;
    if (animation.current) {
      instance = Lottie.loadAnimation({
        container: animation.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: colorify([fillColor, fillColor, fillColor, fillColor], animationData),
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice',
        },
      });
    }

    return () => {
      instance?.destroy();
    };
  }, [contentColor, animationData]);

  return (
    <Space
      testID={testID}
      className={cx(styles.indicator, styles[`size-${size}`])}
      style={{ backgroundColor: getColor(backgroundColor, 'rgba(255, 255, 255, 0.3)') }}
      {...props}
    >
      <div className={cx(styles.indicator, styles[`size-${size}`])} ref={animation} />
    </Space>
  );
};

export default React.memo(AnimationIndicator);
