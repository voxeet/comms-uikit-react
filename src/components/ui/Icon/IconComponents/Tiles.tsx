/* eslint-disable react/destructuring-assignment */
import type { SVGComponent } from './index';

const Tiles = (props: SVGComponent) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={props.fill || 'currentColor'}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.5 3.75H4.5C4.30109 3.75 4.11032 3.82902 3.96967 3.96967C3.82902 4.11032 3.75 4.30109 3.75 4.5V10.5C3.75 10.6989 3.82902 10.8897 3.96967 11.0303C4.11032 11.171 4.30109 11.25 4.5 11.25H10.5C10.6989 11.25 10.8897 11.171 11.0303 11.0303C11.171 10.8897 11.25 10.6989 11.25 10.5V4.5C11.25 4.30109 11.171 4.11032 11.0303 3.96967C10.8897 3.82902 10.6989 3.75 10.5 3.75ZM9.75 9.75H5.25V5.25H9.75V9.75ZM19.5 3.75H13.5C13.3011 3.75 13.1103 3.82902 12.9697 3.96967C12.829 4.11032 12.75 4.30109 12.75 4.5V10.5C12.75 10.6989 12.829 10.8897 12.9697 11.0303C13.1103 11.171 13.3011 11.25 13.5 11.25H19.5C19.6989 11.25 19.8897 11.171 20.0303 11.0303C20.171 10.8897 20.25 10.6989 20.25 10.5V4.5C20.25 4.30109 20.171 4.11032 20.0303 3.96967C19.8897 3.82902 19.6989 3.75 19.5 3.75ZM18.75 9.75H14.25V5.25H18.75V9.75ZM10.5 12.75H4.5C4.30109 12.75 4.11032 12.829 3.96967 12.9697C3.82902 13.1103 3.75 13.3011 3.75 13.5V19.5C3.75 19.6989 3.82902 19.8897 3.96967 20.0303C4.11032 20.171 4.30109 20.25 4.5 20.25H10.5C10.6989 20.25 10.8897 20.171 11.0303 20.0303C11.171 19.8897 11.25 19.6989 11.25 19.5V13.5C11.25 13.3011 11.171 13.1103 11.0303 12.9697C10.8897 12.829 10.6989 12.75 10.5 12.75ZM9.75 18.75H5.25V14.25H9.75V18.75ZM19.5 12.75H13.5C13.3011 12.75 13.1103 12.829 12.9697 12.9697C12.829 13.1103 12.75 13.3011 12.75 13.5V19.5C12.75 19.6989 12.829 19.8897 12.9697 20.0303C13.1103 20.171 13.3011 20.25 13.5 20.25H19.5C19.6989 20.25 19.8897 20.171 20.0303 20.0303C20.171 19.8897 20.25 19.6989 20.25 19.5V13.5C20.25 13.3011 20.171 13.1103 20.0303 12.9697C19.8897 12.829 19.6989 12.75 19.5 12.75ZM18.75 18.75H14.25V14.25H18.75V18.75Z"
      fill={props.fill || 'currentColor'}
    />
  </svg>
);

export default Tiles;