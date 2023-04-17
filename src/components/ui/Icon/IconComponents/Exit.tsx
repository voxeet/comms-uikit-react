/* eslint-disable react/destructuring-assignment */
import type { SVGComponent } from './index';

const Exit = (props: SVGComponent) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 21 19"
    xmlns="http://www.w3.org/2000/svg"
    data-testid={props.testID}
    fill={props.fill || 'currentColor'}
  >
    <path d="m16.8 5.22-1.575 1.484L17.01 8.4H8.4v2.12h8.61l-1.785 1.696L16.8 13.7 21 9.46l-4.2-4.24Z" />
    <path d="M4.305 14.654C2.835 13.276 2.1 11.474 2.1 9.46s.735-3.816 2.205-5.194c2.835-2.862 7.56-2.862 10.395 0l1.47-1.484a9.38 9.38 0 0 0-13.335 0C.945 4.478 0 6.916 0 9.46c0 2.544.945 4.982 2.73 6.784C4.62 18.046 7.035 19 9.45 19s4.83-.954 6.72-2.756l-1.47-1.59c-2.94 2.968-7.56 2.968-10.395 0Z" />
  </svg>
);

export default Exit;
