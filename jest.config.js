/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest/presets/js-with-babel',
  testEnvironment: 'jsdom',
  rootDir: '.',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileTransformer.js',
    '\\.svg$': '<rootDir>/__mocks__/jest-svg-transformer.js',
  },
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
  },
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  jest: {
    setupFiles: ['jest-canvas-mock'],
  },
};
