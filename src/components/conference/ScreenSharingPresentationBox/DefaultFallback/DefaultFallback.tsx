import { Status } from '../../../../hooks/types/misc';
import useScreenSharing from '../../../../hooks/useScreenSharing';
import useTheme from '../../../../hooks/useTheme';
import Button from '../../../ui/Button/Button';
import Icon from '../../../ui/Icon/Icon';
import IconButton from '../../../ui/IconButton/IconButton';
import Space from '../../../ui/Space/Space';
import Text from '../../../ui/Text/Text';

import styles from './DefaultFallback.module.scss';

type DefaultFallbackContentProps = {
  messageText?: string;
  buttonText?: string;
  testID?: string;
};

const DefaultFallbackContent = ({
  messageText,
  buttonText,
  testID = 'DefaultFallback',
}: DefaultFallbackContentProps) => {
  const { startScreenShare, stopScreenShare, status, resetScreenSharingData } = useScreenSharing();
  const { getColor } = useTheme();

  const closePresentation = () => {
    if (status === Status.Active) {
      stopScreenShare();
    } else {
      resetScreenSharingData();
    }
  };

  return (
    <Space testID={testID} fw fh className={styles.fallback} style={{ backgroundColor: getColor('grey.800') }}>
      <Space className={styles.closeIcon}>
        <IconButton size="xs" icon="close" backgroundColor="transparent" onClick={closePresentation} />
      </Space>
      <Space className={styles.contentContainer}>
        <Space className={styles.warningIcon}>
          <Icon color="grey.500" name="warning" size="xl" />
        </Space>
        <Space className={styles.text}>
          <Text type="paragraphSmall">{messageText}</Text>
        </Space>
        <Space mt="m" className={styles.button}>
          <Button onClick={() => startScreenShare()}>
            <Text type="captionSmallDemiBold">{buttonText}</Text>
          </Button>
        </Space>
      </Space>
    </Space>
  );
};

export default DefaultFallbackContent;
