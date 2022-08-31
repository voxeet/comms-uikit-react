/* eslint-disable react/destructuring-assignment */
import type { SVGComponent } from './index';

const SvgDotsHorizontal = (props: SVGComponent) => (
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
      d="M12.75 12a.75.75 0 0 0-1.5 0h1.5Zm-1.5.75a.75.75 0 0 0 1.5 0h-1.5Zm6-.75a.75.75 0 0 0-1.5 0h1.5Zm-1.5.75a.75.75 0 0 0 1.5 0h-1.5Zm-12-.75a.75.75 0 0 0-1.5 0h1.5Zm-1.5.75a.75.75 0 0 0 1.5 0h-1.5Zm19.5-.75a.75.75 0 0 0-1.5 0h1.5Zm-1.5.75a.75.75 0 0 0 1.5 0h-1.5Zm-12-.75a.75.75 0 0 0-1.5 0h1.5Zm-1.5.75a.75.75 0 0 0 1.5 0h-1.5Zm4.5-.75v.75h1.5V12h-1.5Zm4.5 0v.75h1.5V12h-1.5Zm-13.5 0v.75h1.5V12h-1.5Zm18 0v.75h1.5V12h-1.5Zm-13.5 0v.75h1.5V12h-1.5Z"
    />
  </svg>
);

export default SvgDotsHorizontal;
