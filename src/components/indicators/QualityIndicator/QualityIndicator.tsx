/* eslint-disable react/jsx-props-no-spreading */
import type { ColorKey } from '../../../common';
import cx from 'classnames';

import useTheme from '../../../hooks/useTheme';

import styles from './QualityIndicator.module.scss';

type QualityLevel = -1 | 1 | 2 | 3 | 4 | 5;

type QualityIndicatorProps = React.HTMLAttributes<HTMLDivElement> & {
  qualityLevel: QualityLevel;
  backgroundColor?: ColorKey;
  activeColor?: ColorKey;
  defaultColor?: ColorKey;
  testID?: string;
};

const QualityIndicator = ({
  qualityLevel,
  backgroundColor,
  activeColor,
  defaultColor,
  testID,
  ...props
}: QualityIndicatorProps) => {
  const { colors, getColor } = useTheme();

  const handleLineFillColor = (level: QualityLevel) => {
    let fill = getColor(activeColor, colors.grey[600]);
    if (qualityLevel >= level) fill = getColor(defaultColor, colors.white);

    return fill;
  };

  return (
    <div
      data-testid={testID}
      className={cx(styles.quality)}
      style={{ backgroundColor: getColor(backgroundColor, colors.whiteAlpha[500]) }}
      {...props}
    >
      <div
        data-testid="lineFirst"
        className={cx(styles.line, styles.first)}
        style={{ backgroundColor: handleLineFillColor(1) }}
      />
      <div
        data-testid="lineSecond"
        className={cx(styles.line, styles.second)}
        style={{ backgroundColor: handleLineFillColor(2) }}
      />
      <div
        data-testid="lineThird"
        className={cx(styles.line, styles.third)}
        style={{ backgroundColor: handleLineFillColor(3) }}
      />
      <div
        data-testid="lineFourth"
        className={cx(styles.line, styles.fourth)}
        style={{ backgroundColor: handleLineFillColor(4) }}
      />
      <div
        data-testid="lineFifth"
        className={cx(styles.line, styles.fifth)}
        style={{ backgroundColor: handleLineFillColor(5) }}
      />
    </div>
  );
};

export default QualityIndicator;
