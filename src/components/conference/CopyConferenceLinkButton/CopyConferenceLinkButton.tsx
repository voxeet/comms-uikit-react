/* eslint-disable react/jsx-props-no-spreading */
import { useState } from 'react';

import { copyTextToClipboard } from '../../../utils/copyTextToClipboard.util';
import IconButton, { IconButtonProps } from '../../ui/IconButton/IconButton';
import Tooltip, { TooltipProps } from '../../ui/Tooltip/Tooltip';

type CopyConferenceLinkButtonProps = Partial<Omit<IconButtonProps, 'onClick'>> & {
  tooltipText: string;
  successText: string;
  url: string;
  tooltipPosition?: TooltipProps['position'];
  testID?: string;
};

const CopyConferenceLinkButton = ({
  tooltipText,
  successText,
  tooltipPosition = 'top',
  url,
  testID,
  ...rest
}: CopyConferenceLinkButtonProps) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    copyTextToClipboard(url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };
  return (
    <Tooltip position={tooltipPosition} text={copied ? successText : tooltipText}>
      <IconButton testID={testID} backgroundColor="transparent" size="s" icon="copy" onClick={copy} {...rest} />
    </Tooltip>
  );
};

export default CopyConferenceLinkButton;
