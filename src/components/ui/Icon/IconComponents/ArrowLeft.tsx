/* eslint-disable react/destructuring-assignment */
import type { SVGComponent } from './index';

const SvgArrowLeft = (props: SVGComponent) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    viewBox="0 0 256 256"
    data-testid={props.testID}
    fill={props.fill || 'currentColor'}
  >
    <path
      fill="none"
      stroke={props.fill || 'currentColor'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={16}
      d="m160 208-80-80 80-80"
    />
  </svg>
);

export default SvgArrowLeft;
