/* eslint-disable react/destructuring-assignment */
import type { SVGComponent } from './index';

const SvgFailure = (props: SVGComponent) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 24 24"
    fill={props.fill || 'currentColor'}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 1a11 11 0 1 0 11 11A11.01 11.01 0 0 0 12 1Zm0 20.308A9.308 9.308 0 1 1 21.308 12 9.318 9.318 0 0 1 12 21.308Zm3.988-6.526a.857.857 0 0 1 0 1.206.867.867 0 0 1-1.206 0L12 13.195l-2.782 2.793a.867.867 0 0 1-1.206 0 .857.857 0 0 1 0-1.206L10.805 12 8.012 9.218a.857.857 0 0 1 1.206-1.206L12 10.805l2.782-2.793a.857.857 0 0 1 1.206 1.206L13.195 12l2.793 2.782Z"
      fill={props.fill || 'currentColor'}
    />
  </svg>
);

export default SvgFailure;
