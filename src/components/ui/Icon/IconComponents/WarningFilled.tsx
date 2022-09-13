/* eslint-disable react/destructuring-assignment */
import type { SVGComponent } from './index';

const WarningFilled = (props: SVGComponent) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill={props.fill || 'currentColor'}
  >
    <path
      d="M12 1a11 11 0 1 0 0 22 11 11 0 0 0 0-22Zm0 17.6a1.19 1.19 0 0 1-1.188-1.188A1.187 1.187 0 1 1 12 18.6Zm1.188-5.148a1.188 1.188 0 1 1-2.376 0V6.588a1.188 1.188 0 1 1 2.376 0v6.864Z"
      fill={props.fill || 'currentColor'}
    />
  </svg>
);

export default WarningFilled;
