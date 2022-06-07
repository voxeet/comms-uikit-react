import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import reactSvg from 'rollup-plugin-react-svg';
import { terser } from 'rollup-plugin-terser';
import ts from 'typescript';

export default {
  external: ['@uikit/common'],
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.es.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    external(),
    resolve(),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json', typescript: ts }),
    terser(),
    reactSvg({
      svgo: {
        plugins: [],
        multipass: true,
      },
      jsx: false,
      include: null,
      exclude: null,
    }),
    postcss({
      extract: false,
      modules: true,
      use: ['sass'],
    }),
  ],
};
