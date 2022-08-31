/* eslint-disable react/destructuring-assignment */
import type { SVGComponent } from './index';

const SvgDotsVerticalGradient = (props: SVGComponent) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    data-testid={props.testID}
    fill={props.fill || 'currentColor'}
  >
    <path
      fill="url(#dots-vertical-gradient_svg__a)"
      d="M13.5 18a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM12 7.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm0 3a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"
    />
    <defs>
      <linearGradient id="dots-vertical-gradient_svg__a" x1={0} y1={0} x2={24} y2={0} gradientUnits="userSpaceOnUse">
        <stop stopColor="#3E44FE" />
        <stop offset={1} stopColor="#BB5CFF" />
      </linearGradient>
    </defs>
  </svg>
);

export default SvgDotsVerticalGradient;
