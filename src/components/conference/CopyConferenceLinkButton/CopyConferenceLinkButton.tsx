/* eslint-disable react/jsx-props-no-spreading */
import { ReactNode, useMemo, useState } from 'react';

import useTheme from '../../../hooks/useTheme';
import { copyTextToClipboard } from '../../../utils/copyTextToClipboard.util';
import Button from '../../ui/Button/Button';
import Icon from '../../ui/Icon/Icon';
import IconButton, { IconButtonProps } from '../../ui/IconButton/IconButton';
import Space from '../../ui/Space/Space';
import Tooltip, { TooltipProps } from '../../ui/Tooltip/Tooltip';

type CopyConferenceLinkButtonProps = Partial<Omit<IconButtonProps, 'onClick'>> & {
  tooltipText?: string;
  successText?: string;
  url: string;
  tooltipPosition?: TooltipProps['position'];
  testID?: string;
  children?: ReactNode;
};

const CopyConferenceLinkButton = ({
  tooltipText,
  successText,
  tooltipPosition = 'top',
  url,
  testID,
  children,
  icon = 'copy',
  ...rest
}: CopyConferenceLinkButtonProps) => {
  const [copied, setCopied] = useState(false);
  const { isDesktop } = useTheme();
  const copy = async () => {
    if (!isDesktop) {
      if (navigator.share) {
        await navigator.share({
          url,
        });
      }
    }

    copyTextToClipboard(url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const desktopTooltipText = useMemo(() => {
    let text = '';

    if (copied) {
      text = successText || '';
    } else {
      text = tooltipText || '';
    }

    return text;
  }, [copied, successText, tooltipText]);

  return (
    <Tooltip position={tooltipPosition} text={isDesktop ? desktopTooltipText : ''}>
      {children ? (
        <Button testID={testID} variant="primary" onClick={copy}>
          <Space mr="xs">{children}</Space>
          <Icon name={icon} size="s" />
        </Button>
      ) : (
        <IconButton testID={testID} backgroundColor="transparent" size="s" icon={icon} onClick={copy} {...rest} />
      )}
    </Tooltip>
  );
};

export default CopyConferenceLinkButton;
