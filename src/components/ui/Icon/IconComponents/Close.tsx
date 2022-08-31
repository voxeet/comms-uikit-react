/* eslint-disable react/destructuring-assignment */
import type { SVGComponent } from './index';

const SvgClose = (props: SVGComponent) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    data-testid={props.testID}
    fill={props.fill || 'currentColor'}
  >
    <path
      fill={props.fill || 'currentColor'}
      d="M15.28 14.22a.75.75 0 0 1-1.06 1.06L8 9.06l-6.22 6.22a.75.75 0 0 1-1.06-1.06L6.94 8 .72 1.78A.75.75 0 1 1 1.78.72L8 6.94 14.22.72a.75.75 0 1 1 1.06 1.06L9.06 8l6.22 6.22Z"
    />
  </svg>
);

export default SvgClose;
