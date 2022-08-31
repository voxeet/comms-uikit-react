/* eslint-disable react/destructuring-assignment */
import type { SVGComponent } from './index';

const SvgLossless = (props: SVGComponent) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 14 16"
    xmlns="http://www.w3.org/2000/svg"
    data-testid={props.testID}
    fill={props.fill || 'currentColor'}
  >
    <path
      fill={props.fill || 'currentColor'}
      clipRule="evenodd"
      d="M7.75 1.25v13.5a.75.75 0 0 1-1.5 0V1.25a.75.75 0 0 1 1.5 0Zm3 3v7.5a.75.75 0 0 1-1.5 0v-7.5a.75.75 0 0 1 1.5 0Zm-6 7.5v-7.5a.75.75 0 0 0-1.5 0v7.5a.75.75 0 0 0 1.5 0Zm9-5.25v3a.75.75 0 0 1-1.5 0v-3a.75.75 0 0 1 1.5 0Zm-12 3v-3a.75.75 0 0 0-1.5 0v3a.75.75 0 0 0 1.5 0Z"
    />
  </svg>
);

export default SvgLossless;
