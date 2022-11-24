import { countMaxTiles, calculateGrid } from '../videoGrid.util';

describe('VideoGrid Utils', () => {
  test.each`
    width   | height  | maxTiles | assertion
    ${320}  | ${240}  | ${3}     | ${4}
    ${600}  | ${600}  | ${4}     | ${8}
    ${800}  | ${800}  | ${3}     | ${12}
    ${100}  | ${200}  | ${3}     | ${4}
    ${420}  | ${240}  | ${3}     | ${6}
    ${1000} | ${1000} | ${3}     | ${3}
  `("Return proper Max video tiles for '$width' / '$height' ", ({ width, height, maxTiles, assertion }) => {
    expect(countMaxTiles({ container: { width, height } as DOMRect, maxTiles })).toBe(assertion);
  });
});

describe('calculateGrid tests ', () => {
  const elements = [1, 4, 6, 8, 9, 12, 16, 20];
  elements.forEach((element) => {
    test.each`
      width   | height
      ${320}  | ${240}
      ${480}  | ${640}
      ${600}  | ${600}
      ${800}  | ${600}
      ${420}  | ${240}
      ${1000} | ${1000}
    `(`Should return proper value for ${element} for each $width / $height container `, ({ width, height }) => {
      const isLandscape = width > height;
      const result = calculateGrid({ container: { width, height } as DOMRect, elements: element, gap: 2 });
      const assertedRatio =
        (width * Number(result.width.replace('%', ''))) /
        100 /
        ((height * Number(result.height.replace('%', ''))) / 100);
      if (isLandscape) {
        if (element === 1) {
          expect(result.ratio.toFixed(5)).toBe(assertedRatio.toFixed(5));
          expect(result.width).toBe('100%');
          expect(result.height).toBe('100%');
        } else if (element === 2) {
          expect(result.ratio.toFixed(5)).toBe(assertedRatio.toFixed(5));
          expect(result.width).toBe(width > 500 ? '50%' : '100%');
          expect(result.height).toBe(!(width > 500) ? '50%' : '100%');
        } else if (element === 3 || element === 4) {
          expect(result.ratio.toFixed(5)).toBe(assertedRatio.toFixed(5));
          expect(result.width).toBe('50%');
          expect(result.height).toBe('50%');
        } else if (element === 5 || element === 6) {
          expect(result.ratio.toFixed(5)).toBe(assertedRatio.toFixed(5));
          expect(result.width).toBe('33.3333%');
          expect(result.height).toBe('50%');
        } else if (element === 7 || element === 8) {
          expect(result.ratio.toFixed(5)).toBe(assertedRatio.toFixed(5));
          expect(result.width).toBe('25%');
          expect(result.height).toBe('50%');
        } else if (element === 9) {
          expect(result.ratio.toFixed(5)).toBe(assertedRatio.toFixed(5));
          expect(result.width).toBe('33.3333%');
          expect(result.height).toBe('33.3333%');
        } else if (element >= 10 && element <= 12) {
          expect(result.ratio.toFixed(5)).toBe(assertedRatio.toFixed(5));
          expect(result.width).toBe('25%');
          expect(result.height).toBe('33.3333%');
        } else if (element <= 16) {
          expect(result.ratio.toFixed(5)).toBe(assertedRatio.toFixed(5));
          expect(result.width).toBe('25%');
          expect(result.height).toBe('25%');
        } else if (element <= 20) {
          expect(result.ratio.toFixed(5)).toBe(assertedRatio.toFixed(5));
          expect(result.width).toBe('20%');
          expect(result.height).toBe('25%');
        } else {
          expect(result.ratio.toFixed(5)).toBe(assertedRatio.toFixed(5));
          expect(result.width).toBe('16.6667%');
          expect(result.height).toBe('25%');
        }
      } else if (!isLandscape) {
        if (element === 1) {
          expect(result.ratio.toFixed(5)).toBe(assertedRatio.toFixed(5));
          expect(result.width).toBe('100%');
          expect(result.height).toBe('100%');
        } else if (element === 2) {
          expect(result.ratio.toFixed(5)).toBe(assertedRatio.toFixed(5));
          expect(result.width).toBe(width > 500 ? '100%' : '50%');
          expect(result.height).toBe(!(width > 500) ? '100%' : '50%');
        } else if (element === 3 || element === 4) {
          expect(result.ratio.toFixed(5)).toBe(assertedRatio.toFixed(5));
          expect(result.width).toBe('50%');
          expect(result.height).toBe('50%');
        } else if (element === 5 || element === 6) {
          expect(result.ratio.toFixed(5)).toBe(assertedRatio.toFixed(5));
          expect(result.width).toBe('50%');
          expect(result.height).toBe('33.3333%');
        } else if (element === 7 || element === 8) {
          expect(result.ratio.toFixed(5)).toBe(assertedRatio.toFixed(5));
          expect(result.width).toBe('50%');
          expect(result.height).toBe('25%');
        } else if (element === 9) {
          expect(result.ratio.toFixed(5)).toBe(assertedRatio.toFixed(5));
          expect(result.width).toBe('33.3333%');
          expect(result.height).toBe('33.3333%');
        } else if (element >= 10 && element <= 12) {
          expect(result.ratio.toFixed(5)).toBe(assertedRatio.toFixed(5));
          expect(result.width).toBe('33.3333%');
          expect(result.height).toBe('25%');
        } else if (element <= 16) {
          expect(result.ratio.toFixed(5)).toBe(assertedRatio.toFixed(5));
          expect(result.width).toBe('25%');
          expect(result.height).toBe('25%');
        } else if (element <= 20) {
          expect(result.ratio.toFixed(5)).toBe(assertedRatio.toFixed(5));

          expect(result.width).toBe('25%');
          expect(result.height).toBe('20%');
        } else {
          expect(result.ratio.toFixed(5)).toBe(assertedRatio.toFixed(5));
          expect(result.height).toBe('16.6667%');
          expect(result.width).toBe('25%');
        }
      }
    });
  });
});
