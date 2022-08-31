/* eslint-disable react/destructuring-assignment */
import type { SVGComponent } from './index';

const SvgLoader = (props: SVGComponent) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 24 24"
    fill={props.fill || 'currentColor'}
    data-testid={props.testID}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path opacity={0.7} d="M12 23a2.2 2.2 0 1 0 .001-4.4 2.2 2.2 0 0 0 0 4.4Z" fill={props.fill || 'currentColor'} />
    <path opacity={0.3} d="M12 5.4A2.2 2.2 0 1 0 12 1a2.2 2.2 0 0 0 0 4.4Z" fill={props.fill || 'currentColor'} />
    <path
      opacity={0.8}
      d="M5.778 20.423a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z"
      fill={props.fill || 'currentColor'}
    />
    <path
      opacity={0.4}
      d="M18.224 7.977a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z"
      fill={props.fill || 'currentColor'}
    />
    <path
      opacity={0.9}
      d="M3.201 14.201a2.201 2.201 0 1 0 0-4.402 2.201 2.201 0 0 0 0 4.402Z"
      fill={props.fill || 'currentColor'}
    />
    <path opacity={0.5} d="M20.801 14.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z" fill={props.fill || 'currentColor'} />
    <path d="M5.778 7.978a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z" fill={props.fill || 'currentColor'} />
    <path
      opacity={0.6}
      d="M18.224 20.424a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z"
      fill={props.fill || 'currentColor'}
    />
  </svg>
);

export default SvgLoader;
