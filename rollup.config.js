import typescript from '@rollup/plugin-typescript';
import livereload from 'rollup-plugin-livereload';
import { terser } from "rollup-plugin-terser";

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/bundle.min.js',
    format: 'iife',
    name: 'bundle',
  },
  plugins: [livereload(), typescript(), terser()],
};
