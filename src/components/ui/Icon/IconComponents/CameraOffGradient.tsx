/* eslint-disable react/destructuring-assignment */
import type { SVGComponent } from './index';

const SvgCameraOffGradient = (props: SVGComponent) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    data-testid={props.testID}
    fill={props.fill || 'currentColor'}
  >
    <path
      fill="url(#camera-off-gradient_svg__a)"
      d="M22.877 6.851a.75.75 0 0 0-.75-.002L18 9.208v-.583a3.754 3.754 0 0 0-3.75-3.75h-3.855a.75.75 0 0 0 0 1.5h3.855a2.253 2.253 0 0 1 2.25 2.25V13.5a.75.75 0 0 0 .023.183l.006.022c.016.057.04.113.069.165l.011.018c.012.02.025.039.038.057l.015.02a.798.798 0 0 0 .058.065c0 .002.002.003.003.004a.773.773 0 0 0 .144.11l.01.007 5.25 3a.75.75 0 0 0 1.123-.651v-9a.75.75 0 0 0-.373-.649Zm-1.127 8.357L18 13.065v-2.13l3.75-2.143v6.416ZM3.828 1.745a.75.75 0 1 0-1.11 1.01l1.927 2.12H2.25a1.502 1.502 0 0 0-1.5 1.5v9a3.754 3.754 0 0 0 3.75 3.75h12c.306 0 .605-.094.855-.27l3.09 3.4a.75.75 0 0 0 1.11-1.01L3.828 1.745Zm.672 15.88a2.253 2.253 0 0 1-2.25-2.25v-9h3.76l10.226 11.25H4.5Z"
    />
    <defs>
      <linearGradient id="camera-off-gradient_svg__a" x1={0} y1={0} x2={24} y2={0} gradientUnits="userSpaceOnUse">
        <stop stopColor="#3E44FE" />
        <stop offset={1} stopColor="#BB5CFF" />
      </linearGradient>
    </defs>
  </svg>
);

export default SvgCameraOffGradient;
