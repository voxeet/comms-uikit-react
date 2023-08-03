/* eslint-disable react/destructuring-assignment */
import type { SVGComponent } from './index';

const Logout = (props: SVGComponent) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    data-testid={props.testID}
    fill={props.fill || 'currentColor'}
  >
    <path d="M8 21.09a.87.87 0 0 0-.293-.642A1.05 1.05 0 0 0 7 20.182H4V3.818h3c.357 0 .687-.173.866-.454a.838.838 0 0 0 0-.91A1.022 1.022 0 0 0 7 2H3c-.265 0-.52.096-.707.266A.867.867 0 0 0 2 2.909v18.182a.87.87 0 0 0 .293.643c.187.17.441.266.707.266h4c.265 0 .52-.096.707-.266A.867.867 0 0 0 8 21.091Z" />
    <path d="M6.474 12a1 1 0 0 1 1-1h9.732l-1.939-1.768a1 1 0 0 1-.065-1.413l.05-.05.129-.123a1 1 0 0 1 1.367-.01l3.93 3.63a1 1 0 0 1 .057 1.413l-.056.056-3.93 3.629a1 1 0 0 1-1.368-.01l-.13-.123a1 1 0 0 1-.035-1.414l.05-.05L17.204 13h-9.73a1 1 0 0 1-1-1Z" />
  </svg>
);

export default Logout;
