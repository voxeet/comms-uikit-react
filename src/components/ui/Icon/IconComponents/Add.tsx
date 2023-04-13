/* eslint-disable react/destructuring-assignment */
import type { SVGComponent } from './index';

const Add = (props: SVGComponent) => (
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
      d="M11.5213 4.13037C10.9789 4.13037 10.5392 4.57007 10.5392 5.11247V11.4961H4.15599C3.61359 11.4961 3.17389 11.9358 3.17389 12.4782C3.17389 13.0206 3.61359 13.4603 4.15599 13.4603H10.5392V19.8439C10.5392 20.3863 10.9789 20.826 11.5213 20.826C12.0637 20.826 12.5034 20.3863 12.5034 19.8439V13.4603H18.8874C19.4298 13.4603 19.8695 13.0206 19.8695 12.4782C19.8695 11.9358 19.4298 11.4961 18.8874 11.4961H12.5034V5.11247C12.5034 4.57007 12.0637 4.13037 11.5213 4.13037Z"
    />
  </svg>
);

export default Add;
