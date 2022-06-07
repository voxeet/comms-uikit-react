// if there ever will be a need to run tests directly from packages directories
// then something that will help is `root` or `rootMode` option that will tell babel
// to traverse directories upwards from running directory and find config file
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
    '@babel/preset-typescript',
  ],
};
