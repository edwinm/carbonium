import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/carbonium.ts",
  output: [
    {
      file: "dist/bundle.min.js",
      format: "es",
      name: "bundle",
      sourcemap: true,
    },
    {
      file: "dist/bundle.common.min.js",
      format: "cjs",
      name: "bundle",
      sourcemap: true,
    },
  ],
  plugins: [
    typescript({
      clean: true,
    }),
    terser(),
  ],
};
