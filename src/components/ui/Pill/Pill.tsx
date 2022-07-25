/* eslint-disable react/jsx-props-no-spreading */
import type { Sizes } from '../../../common';

import useTheme from '../../../hooks/useTheme';
import Space from '../Space/Space';
import Text from '../Text/Text';

type PillSize = Extract<Sizes, 's' | 'm'>;

export type PillProps = React.HTMLAttributes<HTMLDivElement> & {
  text?: string;
  active?: boolean;
  size?: PillSize;
  testID?: string;
};

const Pill = ({ text, active = false, size = 'm', testID, ...props }: PillProps) => {
  const { getColor } = useTheme();

  return (
    <Space
      css={{
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        height: 20,
        transition: 'color 0.3s, background-color 0.3s',
        maxWidth: 140,
        backgroundColor: active ? getColor('white') : `rgba(255, 255, 255, 0.4)`,
        backdropFilter: active ? 'none' : 'blur(8px)',
        '> span': {
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        },
      }}
      ph="xs"
      testID={testID}
      title={text}
      {...props}
    >
      <Text
        color={active ? getColor('purple.400') : getColor('white')}
        testID={testID && `${testID}-text`}
        type={size === 'm' ? 'captionSmallDemiBold' : 'captionSmallRegular'}
      >
        {text}
      </Text>
    </Space>
  );
};

export default Pill;
