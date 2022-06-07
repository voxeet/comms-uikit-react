/* eslint-disable react/jsx-props-no-spreading */
import type { ColorKey, Sizes } from '@uikit/common';
import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';
import { useMemo } from 'react';

import useTheme from '../../hooks/useTheme';
import { stringToNumber } from '../../utils/stringToNumber.util';
import Text, { TextType } from '../Text/Text';

import styles from './Avatar.module.scss';

type Size = Extract<Sizes, 'xs' | 's' | 'm' | 'l'>;

type AvatarProps = React.HTMLAttributes<HTMLDivElement> & {
  participant: Participant | string | undefined;
  size?: Size;
  borderColor?: ColorKey;
};

const sizeMap: Record<Size, { width: string; height: string; text: TextType }> = {
  xs: {
    width: '24px',
    height: '24px',
    text: 'avatar-xs',
  },
  s: {
    width: '40px',
    height: '40px',
    text: 'avatar-s',
  },
  m: {
    width: '48px',
    height: '48px',
    text: 'avatar-m',
  },
  l: {
    width: '80px',
    height: '80px',
    text: 'avatar-l',
  },
};

const Avatar = ({ participant, size = 'l', borderColor, ...props }: AvatarProps) => {
  if (participant === undefined) {
    return null;
  }
  const { avatars, colors, getColor } = useTheme();
  const name = typeof participant === 'string' ? participant : participant.info.name;
  const firstLetter = useMemo(() => name?.charAt(0), [name]);
  const backgroundColor = useMemo(() => avatars[stringToNumber(name) % avatars.length], [name]);
  const { width, height, text } = sizeMap[size];
  return (
    <div
      className={styles.wrapper}
      style={{ width, height, backgroundColor, borderColor: getColor(borderColor, colors.white) }}
      {...props}
    >
      <Text type={text}>{firstLetter?.toUpperCase()}</Text>
    </div>
  );
};

export default Avatar;
