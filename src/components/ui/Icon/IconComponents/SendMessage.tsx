/* eslint-disable react/destructuring-assignment */
import type { SVGComponent } from './index';

const SvgSendMessage = (props: SVGComponent) => (
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
      d="M20.972 3.028a1.491 1.491 0 0 0-1.463-.384L2.044 7.566a1.51 1.51 0 0 0-.244 2.803l8.034 3.797 3.797 8.034a1.5 1.5 0 0 0 1.35.853h.131a1.492 1.492 0 0 0 1.322-1.087L21.356 4.49a1.49 1.49 0 0 0-.384-1.463ZM14.99 21.553l-3.693-7.79 3.871-3.872a.75.75 0 1 0-1.059-1.06l-3.872 3.872-7.79-3.693 17.465-4.922-4.922 17.465Z"
    />
  </svg>
);

export default SvgSendMessage;
