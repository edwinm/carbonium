import typescript from '@rollup/plugin-typescript';
import { terser } from "rollup-plugin-terser";

export default {
  input: 'src/miq.ts',
  output: {
    file: 'dist/bundle.min.js',
    format: 'es',
    name: 'bundle',
  },
  plugins: [typescript(), terser()],
};
