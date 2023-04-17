import cx from 'classnames';
import type { ReactNode } from 'react';

import useTheme from '../../../hooks/useTheme';
import type { ColorKey } from '../../../theme/types';
import IconButton from '../IconButton/IconButton';
import Overlay from '../Overlay/Overlay';
import Space from '../Space/Space';

import styles from './Modal.module.scss';

type ModalProps = {
  isVisible?: boolean;
  close: () => void;
  backdropColor?: ColorKey;
  backgroundColor?: ColorKey;
  closeButtonColor?: ColorKey;
  closeIconColor?: ColorKey;
  modalWidth?: number;
  closeButton?: boolean;
  overlayClickClose?: boolean;
  children?: ReactNode;
  testID?: string;
};

const Modal = ({
  isVisible,
  close,
  backdropColor = 'black',
  backgroundColor = 'grey.800',
  closeButtonColor = 'grey.500',
  closeIconColor = 'white',
  modalWidth = 375,
  closeButton,
  overlayClickClose,
  children,
  testID,
}: ModalProps) => {
  const { getColor, isDesktop, isTablet, isMobile, isMobileSmall, isLandscape } = useTheme();

  if (!isVisible) return null;

  const isSmartphone = isMobile || isMobileSmall;

  return (
    <Overlay onClick={overlayClickClose ? close : undefined} opacity={0.64} color={backdropColor}>
      <Space
        testID={testID}
        className={cx(
          styles.modalWrapper,
          !isDesktop && styles.mobile,
          isTablet && styles.tablet,
          isLandscape && styles.landscape,
        )}
        style={{
          backgroundColor: getColor(backgroundColor),
          width: isSmartphone && !isLandscape ? '100%' : `${modalWidth}px`,
          height: isMobile && isLandscape ? '100vh' : 'auto',
        }}
        onClick={(e) => {
          // Prevent the click event from bubbling up to the overlay if the user clicks on the modal.
          // Otherwise, the modal will close if the user clicks on the modal.
          if (overlayClickClose) {
            e.stopPropagation();
          }
        }}
      >
        <>
          {closeButton && (
            <Space className={styles.closeButton}>
              <IconButton
                testID="ModalCloseIcon"
                icon="close"
                size="s"
                backgroundColor={isDesktop ? getColor(closeButtonColor) : getColor('transparent')}
                iconColor={getColor(closeIconColor)}
                variant="circle"
                onClick={close}
              />
            </Space>
          )}
          {children}
        </>
      </Space>
    </Overlay>
  );
};

export default Modal;
