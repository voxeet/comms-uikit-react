/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react/destructuring-assignment */
import type { SVGComponent } from './index';

const InfoFilled = (props: SVGComponent) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill={props.fill || 'currentColor'}
  >
    <path
      d="M12 1a11 11 0 1 0 11 11A11.01 11.01 0 0 0 12 1Zm-.211 5.077a1.27 1.27 0 1 1 0 2.538 1.27 1.27 0 0 1 0-2.538Zm1.057 11.846H12a.846.846 0 0 1-.846-.846V12a.846.846 0 0 1 0-1.692H12a.846.846 0 0 1 .846.846v5.077a.846.846 0 1 1 0 1.692Z"
      fill={props.fill || 'currentColor'}
    />
  </svg>
);

export default InfoFilled;
