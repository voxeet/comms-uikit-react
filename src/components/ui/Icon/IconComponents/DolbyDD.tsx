/* eslint-disable react/destructuring-assignment */
import type { SVGComponent } from './index';

const DolbyDD = (props: SVGComponent) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={29} height={20} data-testid={props.testID}>
    <path
      fill="#fff"
      d="M0 0h3.007c2.703 0 5.295 1.054 7.207 2.929A9.905 9.905 0 0 1 13.199 10a9.906 9.906 0 0 1-2.985 7.071A10.293 10.293 0 0 1 3.007 20H0V0Zm28.997 0H25.99a10.293 10.293 0 0 0-7.207 2.929A9.905 9.905 0 0 0 15.798 10a9.905 9.905 0 0 0 2.985 7.071A10.293 10.293 0 0 0 25.99 20H29l-.003-20Z"
    />
  </svg>
);

export default DolbyDD;
