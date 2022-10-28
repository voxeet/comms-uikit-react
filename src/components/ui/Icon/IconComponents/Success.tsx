/* eslint-disable react/destructuring-assignment */
import type { SVGComponent } from './index';

const SvgSuccess = (props: SVGComponent) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 24 24"
    fill={props.fill || 'currentColor'}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12Zm20 0a9 9 0 1 0-18 0 9 9 0 0 0 18 0Z"
      fill={props.fill || 'currentColor'}
    />
    <path
      d="M16.483 8.195a.899.899 0 0 1 1.168-.076l.103.09.085.1a.865.865 0 0 1-.014 1.024l-.084.095-7.504 7.304a.916.916 0 0 1-1.19.078l-.094-.08-3.705-3.634a.86.86 0 0 1 .028-1.204.9.9 0 0 1 1.17-.074l.092.079L9.594 14.9l6.89-6.706Z"
      fill={props.fill || 'currentColor'}
    />
  </svg>
);

export default SvgSuccess;
