import IconButton from '../IconButton/IconButton';
import Text from '../Text/Text';
import Tooltip from '../Tooltip/Tooltip';

import styles from './Copy.module.scss';

// Copied from https://stackoverflow.com/a/60292243
export async function copyToClipboard(textToCopy: string) {
  // Navigator clipboard api needs a secure context (https)
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(textToCopy);
  } else {
    // Use the 'out of viewport hidden text area' trick
    const textArea = document.createElement('textarea');
    textArea.value = textToCopy;

    // Move textarea out of the viewport so it's not visible
    textArea.style.position = 'absolute';
    textArea.style.left = '-999999px';

    document.body.prepend(textArea);
    textArea.select();

    try {
      document.execCommand('copy');
    } finally {
      textArea.remove();
    }
  }
}

type CopyProps = {
  value: string;
  label?: string;
  tooltipText?: string;
  /** Accessible label for the copy button */
  ariaLabel: string;
  onCopy?: () => void;
  testID?: string;
};

const Copy = ({ value, label, tooltipText, ariaLabel, onCopy, testID }: CopyProps) => {
  const copy = async () => {
    if (navigator.share) {
      await navigator.share({
        url: value,
      });
    }

    await copyToClipboard(value);
    onCopy?.();
  };

  const button = (
    <IconButton
      testID="CopyButton"
      aria-label={ariaLabel}
      icon="copy"
      size="m"
      backgroundColor="transparent"
      onClick={copy}
    />
  );

  return (
    <div data-testid={testID} className={styles.container}>
      {label && (
        <Text data-testid={`${testID}Label`} color="grey.200">
          {label}
        </Text>
      )}
      <div className={styles.copy}>
        {tooltipText ? (
          <Tooltip testID="Tooltip" position="top" text={tooltipText}>
            {button}
          </Tooltip>
        ) : (
          button
        )}
        <div className={styles.link}>
          <Text testID="Link">{value}</Text>
        </div>
      </div>
    </div>
  );
};

export default Copy;
