/* eslint-disable react/destructuring-assignment */
import type { SVGComponent } from './index';

const SuccessFilled = (props: SVGComponent) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill={props.fill || 'currentColor'}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12Zm16.651-3.881a.899.899 0 0 0-1.168.076l-6.889 6.706-3.056-3.004-.092-.08a.9.9 0 0 0-1.17.075.86.86 0 0 0-.028 1.204l3.705 3.634.094.08a.916.916 0 0 0 1.19-.078l7.504-7.304.084-.095a.865.865 0 0 0 .014-1.024l-.085-.1-.103-.09Z"
      fill={props.fill || 'currentColor'}
    />
  </svg>
);

export default SuccessFilled;
