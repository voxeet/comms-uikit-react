export type FitInHeightOptions = {
  minWidth: number;
  clientWidth: number;
  clientHeight: number;
  gap?: number;
  rows?: number;
};

const RATIO = 0.5625;

export const fitInHeight = ({ minWidth, clientWidth, clientHeight, gap = 0, rows = 1 }: FitInHeightOptions) => {
  let height = clientHeight / rows;
  let width = height / RATIO;

  if (width < minWidth) {
    width = minWidth;
    height = width * RATIO;
  }

  if (width > clientWidth) {
    width = clientWidth;
    height = width * RATIO;
  }

  return {
    width: width - 2 * gap,
    height: height - 2 * gap,
  };
};
