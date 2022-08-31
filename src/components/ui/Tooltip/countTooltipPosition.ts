import type { TooltipProps } from './Tooltip';

type TooltipPositionArguments = {
  position: TooltipProps['position'];
  wrapperRect?: DOMRect;
  tooltipRect?: DOMRect;
};

export const countTooltipPosition = ({ position, wrapperRect, tooltipRect }: TooltipPositionArguments) => {
  const style = {
    left: 0,
    top: 0,
  };
  if (wrapperRect && tooltipRect) {
    if (position === 'bottom') {
      const top = wrapperRect.bottom + 10; // The default distance between the target element and tooltip is 10px
      style.top = top;
    } else {
      const top = wrapperRect.top - 36; // By default, the tooltip height is 36px. Therefore the distance between the target element and tooltip is 10px.
      style.top = top;
    }
    const left = wrapperRect.left - tooltipRect.width / 2 + wrapperRect.width / 2;
    style.left = left >= 0 ? left : 4;
    if (left + tooltipRect.width > document.body.clientWidth) {
      style.left = document.body.clientWidth - tooltipRect.width;
    }
  }
  return style;
};
