/* eslint-disable react/destructuring-assignment */
import type { SVGComponent } from './index';

const SvgHandsetGradient = (props: SVGComponent) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    data-testid={props.testID}
    fill={props.fill || 'currentColor'}
  >
    <g fill="url(#handset-gradient_svg__a)" clipPath="url(#handset-gradient_svg__b)">
      <path d="M2.814 10.31c5.263-5.264 13.828-5.264 19.092 0a5.257 5.257 0 0 1 .44 6.925 1.504 1.504 0 0 1-1.74.469l-4.44-1.776a1.496 1.496 0 0 1-.91-1.086l-.583-2.788a7.176 7.176 0 0 0-4.657.01l-.553 2.767a1.495 1.495 0 0 1-.914 1.099l-4.436 1.774a1.504 1.504 0 0 1-1.74-.469 5.257 5.257 0 0 1 .44-6.925Zm18.35 6.001a3.752 3.752 0 0 0-.319-4.94 12.014 12.014 0 0 0-16.97 0 3.754 3.754 0 0 0-.316 4.945l4.433-1.78.553-2.765a1.498 1.498 0 0 1 .968-1.12 8.68 8.68 0 0 1 5.656-.013 1.499 1.499 0 0 1 .973 1.11l.582 2.787 4.44 1.776Z" />
    </g>
    <defs>
      <clipPath id="handset-gradient_svg__b">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
    <defs>
      <linearGradient id="handset-gradient_svg__a" x1={0} y1={0} x2={24} y2={0} gradientUnits="userSpaceOnUse">
        <stop stopColor="#3E44FE" />
        <stop offset={1} stopColor="#BB5CFF" />
      </linearGradient>
    </defs>
  </svg>
);

export default SvgHandsetGradient;
