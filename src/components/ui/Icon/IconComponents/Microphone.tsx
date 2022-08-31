/* eslint-disable react/destructuring-assignment */
import type { SVGComponent } from './index';

const SvgMicrophone = (props: SVGComponent) => (
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
      d="M12 16.5a4.505 4.505 0 0 0 4.5-4.5V6a4.5 4.5 0 1 0-9 0v6a4.505 4.505 0 0 0 4.5 4.5ZM9 6a3 3 0 0 1 6 0v6a3 3 0 0 1-6 0V6Zm10.454 6.832a7.484 7.484 0 0 1-6.704 6.63v2.288a.75.75 0 1 1-1.5 0v-2.288a7.485 7.485 0 0 1-6.704-6.63.75.75 0 0 1 1.49-.164 6 6 0 0 0 11.927 0 .75.75 0 0 1 1.491.164Z"
    />
  </svg>
);

export default SvgMicrophone;
