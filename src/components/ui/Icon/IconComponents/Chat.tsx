/* eslint-disable react/destructuring-assignment */
import type { SVGComponent } from './index';

const SvgChat = (props: SVGComponent) => (
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
      d="M3.754 22.392c-.22 0-.438-.049-.637-.142a1.486 1.486 0 0 1-.867-1.36V6a1.502 1.502 0 0 1 1.5-1.5h16.5a1.502 1.502 0 0 1 1.5 1.5v12a1.502 1.502 0 0 1-1.5 1.5H7.734l-3.019 2.538a1.49 1.49 0 0 1-.96.354ZM3.75 6v14.89l3.02-2.538c.27-.227.611-.352.964-.352H20.25V6H3.75Z"
    />
  </svg>
);

export default SvgChat;
