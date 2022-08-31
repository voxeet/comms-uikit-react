/* eslint-disable react/jsx-props-no-spreading */
import type { ColorKey } from '../../../common';

import useTheme from '../../../hooks/useTheme';
import IconComponents from '../Icon/IconComponents';
import Space from '../Space/Space';
import Text from '../Text/Text';

import styles from './Spinner.module.scss';

export type SpinnerProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * The size of an individual dot - the spinner size will scale automatically
   */
  size?: number;
  spinnerColor?: ColorKey;
  textContent?: string | number;
  textContentColor?: ColorKey;
  testID?: string;
};

const Spinner = ({
  size = 32,
  spinnerColor = 'primary.400',
  textContent,
  textContentColor = 'grey.100',
  testID,
  ...props
}: SpinnerProps) => {
  const { getColor } = useTheme();

  const fillColor = getColor(spinnerColor);

  const Loader = IconComponents.loader;

  return (
    <Space testID={testID} className={styles.container} {...props}>
      <Space className={styles.spinnerSection}>
        <Space
          className={styles.spinnerContainer}
          style={{
            height: size,
            width: size,
          }}
        >
          <Loader testID="dots" fill={fillColor} />
        </Space>
      </Space>
      {textContent && (
        <Space pt="m" className={styles.textSection}>
          <Text testID="SpinnerText" type="H4" color={textContentColor}>
            {textContent}
          </Text>
        </Space>
      )}
    </Space>
  );
};

export default Spinner;
