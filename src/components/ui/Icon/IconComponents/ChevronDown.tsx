/* eslint-disable react/destructuring-assignment */
import type { SVGComponent } from './index';

const ChevronDown = (props: SVGComponent) => (
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
      d="M4.65517 9.27524L11.2752 16.2379C11.6558 16.6381 12.2887 16.6541 12.689 16.2735L19.3444 9.27547C19.7116 8.88928 19.7115 8.283 19.3441 7.897L19.2151 7.76152C18.8637 7.39223 18.2973 7.35049 17.8976 7.64573L17.7835 7.74399L11.9989 13.8271L6.23298 7.76222C5.88171 7.39274 5.31536 7.3507 4.91549 7.64571L4.8012 7.74406L4.65529 7.89701C4.28813 8.28304 4.28807 8.88914 4.65517 9.27524Z"
    />
  </svg>
);

export default ChevronDown;
