/* eslint-disable react/jsx-props-no-spreading */
import type { ColorKey, Sizes } from '../../common';
import cx from 'classnames';
import { useMemo } from 'react';

import useTheme from '../../hooks/useTheme';
import Text, { TextType } from '../Text/Text';

import styles from './Pill.module.scss';

type PillSize = Extract<Sizes, 's' | 'm'>;

type PillProps = React.HTMLAttributes<HTMLDivElement> & {
  text?: string;
  active?: boolean;
  size?: PillSize;
  textColor?: {
    default: ColorKey | [ColorKey, ColorKey];
    active: ColorKey | [ColorKey, ColorKey];
  };
  backgroundColor?: {
    default: ColorKey | [ColorKey, ColorKey];
    active: ColorKey | [ColorKey, ColorKey];
  };
  testID?: string;
};

const sizeMap: Record<PillSize, { text: TextType }> = {
  m: {
    text: 'pill',
  },
  s: {
    text: 'pill-s',
  },
};

const Pill = ({ text, active = false, size = 'm', textColor, backgroundColor, testID, ...props }: PillProps) => {
  const { getColor, getGradient, getColorOrGradient } = useTheme();

  const handleBackgroundColor = useMemo(() => {
    let color: string | string[] = active ? getColor('white') : getColor('whiteAlpha.500');

    if (backgroundColor) {
      color = getColorOrGradient(backgroundColor[active ? 'active' : 'default']);
    }

    if (Array.isArray(color)) {
      return {
        background: `-webkit-linear-gradient(99.69deg,${color[0]} -10.66%, ${color[1]} 114.64%)`,
      };
    }
    return {
      backgroundColor: color,
    };
  }, [active, backgroundColor]);

  const handleTextColor = useMemo(() => {
    let color: string | string[] = active ? getGradient(['blue.400', 'purple.400']) : getColor('white');

    if (textColor) {
      color = getColorOrGradient(textColor[active ? 'active' : 'default']);
    }

    if (Array.isArray(color)) {
      return {
        background: `-webkit-linear-gradient(99.69deg,${color[0]} -10.66%, ${color[1]} 114.64%)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      };
    }
    return {
      color,
    };
  }, [active, textColor]);

  return (
    <div className={cx(styles.pill)} style={handleBackgroundColor} data-testid={testID} title={text} {...props}>
      <Text testID={testID && `${testID}-text`} type={sizeMap[size].text} style={handleTextColor}>
        {text}
      </Text>
    </div>
  );
};

export default Pill;
