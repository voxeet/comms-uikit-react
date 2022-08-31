/* eslint-disable react/destructuring-assignment */
import type { SVGComponent } from './index';

const SvgPin = (props: SVGComponent) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    data-testid={props.testID}
    fill={props.fill || 'currentColor'}
  >
    <g clipPath="url(#pin_svg__a)">
      <path
        fill={props.fill || 'currentColor'}
        d="M17.09 2.95a1.491 1.491 0 0 0-1.061-.437H7.98a1.51 1.51 0 0 0-1.498 1.498v7.783c-.928.49-2.811 1.83-3.136 4.872A1.49 1.49 0 0 0 4.84 18.33h6.417l-.007 4.554a.76.76 0 0 0 .756.756.77.77 0 0 0 .755-.756l-.006-4.554h6.39c.398 0 .779-.157 1.06-.437l.074-.073a1.53 1.53 0 0 0 .351-1.2c-.43-3.03-1.962-4.309-3.102-4.853V4.011a1.491 1.491 0 0 0-.438-1.06Zm-1.068 9.328a.768.768 0 0 0 .517.716c1.883.623 2.44 2.678 2.605 3.838H4.84c.152-1.452.755-2.386 1.339-2.97.583-.583 1.246-.862 1.292-.868a.769.769 0 0 0 .517-.716L7.981 4.01h8.048l-.007 8.267Z"
      />
    </g>
    <defs>
      <clipPath id="pin_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgPin;
