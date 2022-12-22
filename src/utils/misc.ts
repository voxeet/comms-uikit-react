export const isEdgeOrChromeBrowser =
  (navigator.userAgent.match(/chrome|chromium/i) || navigator.userAgent.match(/edg/i)) &&
  navigator.userAgent.indexOf('Mobile') === -1;
