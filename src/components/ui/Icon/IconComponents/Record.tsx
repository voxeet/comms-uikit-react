/* eslint-disable react/destructuring-assignment */
import type { SVGComponent } from './index';

const SvgRecord = (props: SVGComponent) => (
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
      d="M12 2.25A9.75 9.75 0 1 0 21.75 12 9.769 9.769 0 0 0 12 2.25Zm0 18A8.25 8.25 0 1 1 20.25 12 8.26 8.26 0 0 1 12 20.25Zm0-15A6.75 6.75 0 1 0 18.75 12 6.76 6.76 0 0 0 12 5.25Zm0 12a5.25 5.25 0 1 1 0-10.5 5.25 5.25 0 0 1 0 10.5Z"
    />
  </svg>
);

export default SvgRecord;
