/* eslint-disable react/destructuring-assignment */
import type { SVGComponent } from './index';

const SvgInfo = (props: SVGComponent) => (
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
      d="M12 1c6.072 0 11 4.928 11 11s-4.928 11-11 11S1 18.072 1 12 5.928 1 12 1Zm0 2c-4.967 0-9 4.033-9 9s4.033 9 9 9 9-4.033 9-9-4.033-9-9-9Zm.19 3.21c-.21-.14-.46-.21-.71-.21a1.246 1.246 0 0 0-1.26 1.26A1.259 1.259 0 0 0 11 8.44c.23.09.48.12.73.07.25-.05.47-.17.65-.35.18-.18.3-.4.35-.65.05-.24.03-.5-.07-.73-.1-.23-.26-.43-.47-.57Zm-.5 11.64h.85c.23 0 .44-.09.6-.25a.84.84 0 0 0 .25-.6.857.857 0 0 0-.85-.85v-5.08a.857.857 0 0 0-.85-.85h-.85a.84.84 0 0 0-.6.25.84.84 0 0 0-.25.6.857.857 0 0 0 .85.85V17a.857.857 0 0 0 .85.85Z"
    />
  </svg>
);

export default SvgInfo;
