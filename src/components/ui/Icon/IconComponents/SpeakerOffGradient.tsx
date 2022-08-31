/* eslint-disable react/destructuring-assignment */
import type { SVGComponent } from './index';

const SvgSpeakerOffGradient = (props: SVGComponent) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    data-testid={props.testID}
    fill={props.fill || 'currentColor'}
  >
    <path
      fill="url(#speaker-off-gradient_svg__a)"
      d="M23.248 12.001a7.45 7.45 0 0 1-2.197 5.303.748.748 0 0 1-1.227-.24.75.75 0 0 1 .166-.82 6 6 0 0 0 0-8.486.751.751 0 0 1 .53-1.283.75.75 0 0 1 .531.223A7.45 7.45 0 0 1 23.248 12Zm-5.25 0a2.234 2.234 0 0 1-.66 1.591.748.748 0 0 0 .242 1.227.75.75 0 0 0 .82-.166 3.749 3.749 0 0 0 0-5.304.75.75 0 0 0-1.061 1.061 2.237 2.237 0 0 1 .659 1.591Zm2.057 7.744a.75.75 0 1 1-1.11 1.01L15 16.415v4.586a.75.75 0 0 1-1.21.592l-6.547-5.092H3a1.502 1.502 0 0 1-1.5-1.5v-6a1.502 1.502 0 0 1 1.5-1.5h3.896L3.945 4.255a.75.75 0 0 1 1.11-1.01l15 16.5ZM3 15.001h3.75v-6H3v6Zm10.5-.236L8.25 8.989v6.395l5.25 4.084v-4.703Zm-2.525-8.267L13.5 4.535v5.48a.75.75 0 0 0 1.5 0V3.001a.75.75 0 0 0-1.21-.592l-3.736 2.905a.75.75 0 0 0 .921 1.184Z"
    />
    <defs>
      <linearGradient id="speaker-off-gradient_svg__a" x1={0} y1={0} x2={24} y2={0} gradientUnits="userSpaceOnUse">
        <stop stopColor="#3E44FE" />
        <stop offset={1} stopColor="#BB5CFF" />
      </linearGradient>
    </defs>
  </svg>
);

export default SvgSpeakerOffGradient;
