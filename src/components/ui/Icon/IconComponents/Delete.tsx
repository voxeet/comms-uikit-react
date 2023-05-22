/* eslint-disable react/destructuring-assignment */
import type { SVGComponent } from './index';

const Delete = (props: SVGComponent) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 25 24"
    xmlns="http://www.w3.org/2000/svg"
    data-testid={props.testID}
    fill={props.fill || 'currentColor'}
  >
    <path d="M19.403 8.205c.21.014.408.102.552.246a.747.747 0 0 1 .223.53V19.84a2.313 2.313 0 0 1-.75 1.628 2.66 2.66 0 0 1-1.749.699H7.686a2.66 2.66 0 0 1-1.748-.7 2.313 2.313 0 0 1-.75-1.627V8.98a.744.744 0 0 1 .196-.566.876.876 0 0 1 1.178-.088.762.762 0 0 1 .29.655V19.84a.75.75 0 0 0 .245.548.865.865 0 0 0 .589.227h9.993a.866.866 0 0 0 .59-.227.75.75 0 0 0 .243-.548V8.98a.745.745 0 0 1 .198-.51.85.85 0 0 1 .51-.265.893.893 0 0 1 .183 0Zm-4.997 1.551a.682.682 0 0 1 .275.055.823.823 0 0 1 .346.25c.09.11.145.24.162.378a.295.295 0 0 1-.008.093v6.205a.732.732 0 0 1-.083.341.794.794 0 0 1-.28.303.888.888 0 0 1-.825.063.82.82 0 0 1-.328-.257.74.74 0 0 1-.15-.45v-6.205a.582.582 0 0 1 .042-.256.778.778 0 0 1 .265-.353.866.866 0 0 1 .426-.167h.158Zm-3.33 0a.637.637 0 0 1 .266.055.82.82 0 0 1 .345.25c.09.11.146.24.163.378a.297.297 0 0 1 0 .093v6.205a.732.732 0 0 1-.084.341.794.794 0 0 1-.279.303.888.888 0 0 1-.825.063.82.82 0 0 1-.328-.257.79.79 0 0 1-.15-.45v-6.205a.467.467 0 0 1 .05-.256.778.778 0 0 1 .265-.353.866.866 0 0 1 .426-.167h.15ZM8.517 5.103V2.776a.612.612 0 0 1 .05-.256.778.778 0 0 1 .265-.353A.866.866 0 0 1 9.26 2h6.795a.884.884 0 0 1 .621.312c.09.11.145.24.162.378l.008.086v2.327h4.373c.158.04.3.123.409.238a.73.73 0 0 1 .12.853.8.8 0 0 1-.33.328.724.724 0 0 1-.407.132H4.354a.788.788 0 0 1-.141 0 .858.858 0 0 1-.46-.211.76.76 0 0 1-.24-.422.728.728 0 0 1 .07-.473.803.803 0 0 1 .355-.345.757.757 0 0 1 .416-.1h4.164Zm6.663 0V3.55h-4.997v1.552h4.997Z" />
  </svg>
);

export default Delete;