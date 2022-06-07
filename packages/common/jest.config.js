/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

module.exports = {
  preset: 'ts-jest/presets/js-with-babel',
  testEnvironment: 'node',
  rootDir: 'src',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  verbose: true,
};
