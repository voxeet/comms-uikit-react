/* eslint-disable react/destructuring-assignment */
import type { SVGComponent } from './index';

const ChevronUp = (props: SVGComponent) => (
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
      d="M19.3444 14.7245L12.7244 7.7619C12.3439 7.36166 11.7109 7.34569 11.3106 7.72624L4.65517 14.7243C4.28798 15.1105 4.28814 15.7168 4.65551 16.1028L4.78446 16.2382C5.13592 16.6075 5.7023 16.6493 6.10201 16.354L6.2161 16.2558L12.0007 10.1727L17.7666 16.2375C18.1179 16.607 18.6842 16.6491 19.0841 16.354L19.1984 16.2557L19.3443 16.1027C19.7115 15.7167 19.7115 15.1106 19.3444 14.7245Z"
    />
  </svg>
);

export default ChevronUp;
