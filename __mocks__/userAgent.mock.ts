Object.defineProperty(
  window.navigator,
  'userAgent',
  ((value) => ({
    get() {
      return value;
    },
    set(v) {
      // As we are mocking behaviour, we will do this reassign for now
      // eslint-disable-next-line no-param-reassign
      value = v;
    },
  }))(window.navigator.userAgent),
);
