export type CountMaxTilesOptions = {
  container: DOMRect;
  maxTiles: number;
};

export type CalculateGridOptions = {
  container: DOMRect;
  elements: number;
  gap: number;
};

const RATIO = 0.5625;

export const countMaxTiles = ({ container, maxTiles }: CountMaxTilesOptions) => {
  let actualMax = 1;
  const area = (container.width * container.height) / 10000;
  if (area < 10) {
    actualMax = 4;
  } else if (area < 16) {
    actualMax = 6;
  } else if (area < 60) {
    actualMax = 8;
  } else if (area < 80) {
    actualMax = 12;
  } else if (area < 100) {
    actualMax = 20;
  } else {
    actualMax = maxTiles;
  }
  return actualMax;
};

export const calculateGrid = ({ container, elements, gap }: CalculateGridOptions) => {
  const isLandscape = container.width > container.height;

  let width;
  let height;

  if (elements === 1) {
    width = 100;
    height = 100;
  } else if (elements === 2) {
    if (isLandscape && container.width > 500) {
      width = 50;
      height = 100;
    } else {
      width = 100;
      height = 50;
    }
  } else if (elements === 3 || elements === 4) {
    width = 50;
    height = 50;
  } else if (elements === 5 || elements === 6) {
    if (isLandscape) {
      width = 33.3333;
      height = 50;
    } else {
      width = 50;
      height = 33.3333;
    }
  } else if (elements === 7 || elements === 8) {
    if (isLandscape) {
      width = 25;
      height = 50;
    } else {
      width = 50;
      height = 25;
    }
  } else if (elements === 9) {
    width = 33.3333;
    height = 33.333;
  } else if (elements === 10 || elements === 11 || elements === 12) {
    if (isLandscape) {
      width = 25;
      height = 33.3333;
    } else {
      width = 33.3333;
      height = 25;
    }
  } else {
    // eslint-disable-next-line no-lonely-if
    if (isLandscape) {
      if (elements <= 16) {
        width = 25;
        height = 25;
      } else if (elements <= 20) {
        width = 20;
        height = 25;
      } else {
        width = 16.6667;
        height = 25;
      }
    } else if (elements <= 16) {
      width = 25;
      height = 25;
    } else if (elements <= 20) {
      width = 25;
      height = 20;
    } else {
      width = 25;
      height = 16.6667;
    }
  }

  const wPercent = width / 100;
  const hPercent = height / 100;
  const ratio = (container.width * wPercent) / (container.height * hPercent);

  let ratioHeight = (container.height - gap) * hPercent - gap;
  let ratioWidth = ratioHeight / RATIO;
  if (elements === 2) {
    ratioWidth = (container.width - gap) * wPercent - gap;
    ratioHeight = ratioWidth * RATIO;
  }

  return {
    ratio,
    width: `${width}%`,
    height: `${height}%`,
    maxWidth: `${width}%`,
    maxHeight: `${height}%`,
    ratioWidth,
    ratioHeight,
  };
};

export type CalculateGrid = ReturnType<typeof calculateGrid>;

export const manipulateSize = (
  container: DOMRect | null,
  size: CalculateGrid,
  index: number,
  tiles: number,
  rest: number,
) => {
  if (container) {
    const isTallTile = size.ratio < 0.65 && container.width < 600;
    const isLandscape = container.width > container.height;
    const isAlone = index === tiles - 1 && tiles % 2 === 1 && size.width === '50%' && rest === 0;
    if (isLandscape && tiles === 2 && rest === 0 && container.width > 500) {
      return {
        width: size.ratioWidth,
        height: isTallTile ? size.ratioHeight / 2 : size.ratioHeight,
        maxWidth: size.maxWidth,
        maxHeight: size.maxHeight,
      };
    }
    if (isAlone) {
      if (container.width <= 600 && size.ratioHeight > 200) {
        return {
          width: '100%',
          height: isTallTile ? size.ratioHeight / 2 : size.height,
        };
      }
    }
    return {
      width: size.ratioWidth,
      height: isTallTile ? size.ratioHeight / 2 : size.height,
      maxWidth: size.maxWidth,
      maxHeight: size.maxHeight,
    };
  }
  return size;
};
