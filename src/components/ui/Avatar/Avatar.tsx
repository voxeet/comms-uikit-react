import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';
import { useMemo } from 'react';

import useTheme from '../../../hooks/useTheme';
import type { ColorKey, Sizes } from '../../../theme/types';
import { stringToNumber } from '../../../utils/stringToNumber.util';
import Space from '../Space/Space';
import Text, { TextType } from '../Text/Text';

import styles from './Avatar.module.scss';

type Size = Extract<Sizes, 'xs' | 's' | 'm' | 'l'>;

export type AvatarProps = React.HTMLAttributes<HTMLDivElement> & {
  participant?: Participant | string | null;
  size?: Size;
  borderColor?: ColorKey;
  testID?: string;
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

const Avatar = ({ participant, size = 'l', borderColor, testID, ...props }: AvatarProps) => {
  if (!participant) {
    return null;
  }
  const { avatars, getColor } = useTheme();
  const name = typeof participant === 'string' ? participant : participant.info.name;
  const [firstNameLetter, lastNameLetter] = useMemo(() => {
    let firstValue;
    let lastValue;
    if (name) {
      firstValue = name.charAt(0);
      const nameArray = name.split(' ');
      lastValue = nameArray.length > 1 ? nameArray[nameArray.length - 1].charAt(0) : '';
    }
    return [firstValue, lastValue];
  }, [name]);

  const backgroundColor = useMemo(
    () =>
      avatars[
        stringToNumber(name + (typeof participant === 'object' ? (participant as Participant).id.slice(0, 2) : '')) %
          avatars.length
      ],
    [name],
  );
  const { width, height, text } = sizeMap[size];
  return (
    <Space
      testID={testID}
      className={styles.wrapper}
      style={{ width, height, backgroundColor, borderColor: getColor(borderColor, 'white') }}
      {...props}
    >
      <Text testID={`${testID}-text`} type={text}>
        {firstNameLetter?.toUpperCase()}
        {['m', 'l'].includes(size) ? lastNameLetter?.toUpperCase() : undefined}
      </Text>
    </Space>
  );
};

export default Avatar;
