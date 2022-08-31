/* eslint-disable react/destructuring-assignment */
import type { SVGComponent } from './index';

const SvgHeadphonesGradient = (props: SVGComponent) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    data-testid={props.testID}
    fill={props.fill || 'currentColor'}
  >
    <path
      fill="url(#headphones-gradient_svg__a)"
      d="M19.003 5.831A9.665 9.665 0 0 0 12.066 3H12a9.75 9.75 0 0 0-9.75 9.75V18a2.26 2.26 0 0 0 2.25 2.25H6A2.26 2.26 0 0 0 8.25 18v-3.75A2.26 2.26 0 0 0 6 12H3.788a8.231 8.231 0 0 1 8.278-7.5h.009a8.25 8.25 0 0 1 8.278 7.5h-2.212a2.25 2.25 0 0 0-2.25 2.25V18a2.25 2.25 0 0 0 2.25 2.25h1.5A2.26 2.26 0 0 0 21.89 18v-5.25a9.703 9.703 0 0 0-2.888-6.919ZM6 13.501a.75.75 0 0 1 .75.75V18a.75.75 0 0 1-.75.75H4.5a.75.75 0 0 1-.75-.75v-4.5H6ZM20.39 18a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-3.75a.75.75 0 0 1 .75-.75h2.25V18Z"
    />
    <defs>
      <linearGradient id="headphones-gradient_svg__a" x1={0} y1={0} x2={24} y2={0} gradientUnits="userSpaceOnUse">
        <stop stopColor="#3E44FE" />
        <stop offset={1} stopColor="#BB5CFF" />
      </linearGradient>
    </defs>
  </svg>
);

export default SvgHeadphonesGradient;
