/* eslint-disable react/destructuring-assignment */
import type { SVGComponent } from './index';

const SvgMicrophoneOff = (props: SVGComponent) => (
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
      d="m20.055 19.745-15-16.5a.75.75 0 1 0-1.11 1.01L7.5 8.165V12a4.5 4.5 0 0 0 6.93 3.787l1.019 1.122a5.999 5.999 0 0 1-9.412-4.241.75.75 0 0 0-1.491.164 7.485 7.485 0 0 0 6.704 6.63v2.288a.75.75 0 0 0 1.5 0v-2.288a7.473 7.473 0 0 0 3.714-1.436l2.481 2.729a.75.75 0 1 0 1.11-1.01ZM12 15a3.004 3.004 0 0 1-3-3V9.815l4.399 4.839A2.994 2.994 0 0 1 12 15ZM8.17 3.635A4.5 4.5 0 0 1 16.5 6v5.665a.75.75 0 1 1-1.5 0V6a3 3 0 0 0-5.553-1.576.75.75 0 1 1-1.276-.789Zm9.42 10.55a5.97 5.97 0 0 0 .373-1.517.75.75 0 0 1 1.491.164 7.467 7.467 0 0 1-.467 1.899.75.75 0 0 1-1.397-.547Z"
    />
  </svg>
);

export default SvgMicrophoneOff;
