import type { TooltipProps } from './Tooltip';

type TooltipPositionArguments = {
  position: TooltipProps['position'];
  wrapperRect?: DOMRect;
  tooltipRect?: DOMRect;
};

export const countTooltipPosition = ({ position, wrapperRect, tooltipRect }: TooltipPositionArguments) => {
  const style = {
    bottom: 0,
    left: 0,
  };
  if (wrapperRect && tooltipRect) {
    if (position === 'bottom') {
      const bottom = document.body.clientHeight - (wrapperRect.top + window.pageYOffset + wrapperRect.height + 38 + 5);
      style.bottom = bottom >= 0 ? bottom : 4;
    } else {
      const bottom = document.body.clientHeight - (wrapperRect.top + window.pageYOffset - 5);
      style.bottom = bottom >= 0 ? bottom : 4;
    }
    const left = wrapperRect.left - tooltipRect.width / 2 + wrapperRect.width / 2;
    style.left = left >= 0 ? left : 4;
    if (left + tooltipRect.width > document.body.clientWidth) {
      style.left = document.body.clientWidth - tooltipRect.width;
    }
  }
  return style;
};
