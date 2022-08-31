/* eslint-disable react/destructuring-assignment */
import type { SVGComponent } from './index';

const SvgSpeakerOff = (props: SVGComponent) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 17 14"
    xmlns="http://www.w3.org/2000/svg"
    data-testid={props.testID}
    fill={props.fill || 'currentColor'}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.233.859a1.5 1.5 0 0 1 2.51.962l.006.14v10.08a1.5 1.5 0 0 1-2.407 1.194l-.108-.09-3.404-3.13-1.59-.01A1.5 1.5 0 0 1 .755 8.616L.75 8.505V5.494a1.5 1.5 0 0 1 1.388-1.496l.112-.004h1.582l3.4-3.135Zm5.976 3.837.07.062.97.97.97-.97.07-.062a.75.75 0 0 1 1.053 1.052l-.062.07-.97.97.97.97a.75.75 0 0 1-.99 1.123l-.07-.062-.97-.97-.97.97-.07.062a.75.75 0 0 1-1.053-1.052l.062-.07.97-.971-.97-.97a.75.75 0 0 1 .99-1.122Zm-8.36.4 3.4-3.134v10.08L4.846 8.91l-.107-.09a1.5 1.5 0 0 0-.9-.306l-1.589-.01v-3.01h1.582l.14-.007a1.5 1.5 0 0 0 .876-.39Z"
      fill={props.fill || 'currentColor'}
    />
  </svg>
);

export default SvgSpeakerOff;
