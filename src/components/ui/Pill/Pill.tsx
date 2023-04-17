import useTheme from '../../../hooks/useTheme';
import type { Sizes } from '../../../theme/types';
import Space from '../Space/Space';
import Text, { TextType } from '../Text/Text';

type PillSize = Extract<Sizes, 's' | 'm' | 'l'>;

export type PillProps = React.HTMLAttributes<HTMLDivElement> & {
  text?: string;
  label?: string;
  active?: boolean;
  size?: PillSize;
  testID?: string;
};

const Pill = ({ text, label, active = false, size = 'm', testID, ...props }: PillProps) => {
  const { getColor } = useTheme();

  return (
    <Space
      css={{
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        height: 20,
        transition: 'color 0.3s, background-color 0.3s',
        maxWidth: 140,
        backgroundColor: active ? getColor('white') : `rgba(255, 255, 255, 0.4)`,
        backdropFilter: active ? 'none' : 'blur(8px)',
        '> span:first-of-type': {
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        },
      }}
      ph="xs"
      pv="xxxs"
      testID={testID}
      title={text}
      {...props}
    >
      <Text
        color={active ? getColor('purple.400') : getColor('white')}
        testID={testID && `${testID}-text`}
        type={getTextType()}
      >
        {text}
      </Text>
      {label && (
        <>
          <span>&nbsp;</span>
          <Text
            color={active ? getColor('purple.400') : getColor('white')}
            testID={testID && `${testID}-text-local`}
            type={getTextType()}
          >
            {`(${label})`}
          </Text>
        </>
      )}
    </Space>
  );

  function getTextType(): TextType {
    switch (size) {
      case 'm':
        return 'captionSmallDemiBold';
      case 'l':
        return 'caption';
      default:
        return 'captionSmallDemiBoldMobile';
    }
  }
};

export default Pill;
