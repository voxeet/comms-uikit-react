/* eslint-disable react/destructuring-assignment */
import type { SVGComponent } from './index';

const SvgSpeaker = (props: SVGComponent) => (
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
      d="M23.247 12a7.45 7.45 0 0 1-2.196 5.303.749.749 0 0 1-1.28-.53.75.75 0 0 1 .219-.53 6 6 0 0 0 0-8.486.75.75 0 0 1 1.06-1.06A7.45 7.45 0 0 1 23.247 12ZM15 3v18a.749.749 0 0 1-1.21.592L7.243 16.5H3A1.501 1.501 0 0 1 1.5 15V9A1.502 1.502 0 0 1 3 7.5h4.243l6.547-5.092A.75.75 0 0 1 15 3ZM3 15h3.75V9H3v6ZM13.5 4.533 8.25 8.617v6.766l5.25 4.084V4.533Zm3.838 4.815a.75.75 0 0 0 0 1.061 2.249 2.249 0 0 1 0 3.182.751.751 0 0 0 .817 1.225.748.748 0 0 0 .244-.164 3.75 3.75 0 0 0 0-5.304.75.75 0 0 0-1.06 0Z"
    />
  </svg>
);

export default SvgSpeaker;
