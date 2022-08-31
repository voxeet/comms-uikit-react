/* eslint-disable react/destructuring-assignment */
import type { SVGComponent } from './index';

const SvgDotsHorizontalGradient = (props: SVGComponent) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    data-testid={props.testID}
    fill={props.fill || 'currentColor'}
  >
    <path
      fill="url(#dots-horizontal-gradient_svg__a)"
      d="M12.75 12a.75.75 0 0 0-1.5 0h1.5Zm-1.5.75a.75.75 0 0 0 1.5 0h-1.5Zm6-.75a.75.75 0 0 0-1.5 0h1.5Zm-1.5.75a.75.75 0 0 0 1.5 0h-1.5Zm-12-.75a.75.75 0 0 0-1.5 0h1.5Zm-1.5.75a.75.75 0 0 0 1.5 0h-1.5Zm19.5-.75a.75.75 0 0 0-1.5 0h1.5Zm-1.5.75a.75.75 0 0 0 1.5 0h-1.5Zm-12-.75a.75.75 0 0 0-1.5 0h1.5Zm-1.5.75a.75.75 0 0 0 1.5 0h-1.5Zm4.5-.75v.75h1.5V12h-1.5Zm4.5 0v.75h1.5V12h-1.5Zm-13.5 0v.75h1.5V12h-1.5Zm18 0v.75h1.5V12h-1.5Zm-13.5 0v.75h1.5V12h-1.5Z"
    />
    <defs>
      <linearGradient id="dots-horizontal-gradient_svg__a" x1={0} y1={0} x2={24} y2={0} gradientUnits="userSpaceOnUse">
        <stop stopColor="#3E44FE" />
        <stop offset={1} stopColor="#BB5CFF" />
      </linearGradient>
    </defs>
  </svg>
);

export default SvgDotsHorizontalGradient;
