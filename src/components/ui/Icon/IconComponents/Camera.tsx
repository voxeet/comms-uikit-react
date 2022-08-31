/* eslint-disable react/destructuring-assignment */
import type { SVGComponent } from './index';

const SvgCamera = (props: SVGComponent) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    data-testid={props.testID}
    fill={props.fill || 'currentColor'}
  >
    <path
      fill={props.fill || 'currentColor'}
      d="M22.877 6.851a.75.75 0 0 0-.75-.002L18 9.208v-.583a3.754 3.754 0 0 0-3.75-3.75h-12a1.502 1.502 0 0 0-1.5 1.5v9a3.754 3.754 0 0 0 3.75 3.75h12a1.502 1.502 0 0 0 1.5-1.5v-2.833l4.128 2.36a.75.75 0 0 0 1.122-.652v-9a.75.75 0 0 0-.373-.649ZM16.5 17.625h-12a2.253 2.253 0 0 1-2.25-2.25v-9h12a2.253 2.253 0 0 1 2.25 2.25v9Zm5.25-2.417L18 13.065v-2.13l3.75-2.143v6.416Z"
    />
  </svg>
);

export default SvgCamera;
