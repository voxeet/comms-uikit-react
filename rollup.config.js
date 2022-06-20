import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import svgr from '@svgr/rollup';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import ts from 'typescript';

export default {
  external: ['@dolbyio/comms-uikit-common', 'react', 'react-dom'],
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
    json(),
    svgr({
      icon: true,
    }),
    postcss({
      extract: false,
      modules: true,
      use: ['sass'],
    }),
  ],
};
