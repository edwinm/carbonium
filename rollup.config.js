import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import replace from "@rollup/plugin-replace";
import pkg from "./package.json";

export default {
  input: "src/carbonium.ts",
  output: [
    {
      file: "dist/bundle.min.js",
      format: "es",
      name: "bundle",
      sourcemap: true,
      plugins: [terser()],
    },
    {
      file: "dist/bundle.js",
      format: "es",
      name: "bundle",
      sourcemap: true,
    },
    {
      file: "dist/bundle.iife.min.js",
      format: "iife",
      name: "carbonium",
      sourcemap: true,
      plugins: [terser()],
    },
  ],
  plugins: [
    replace({
      preventAssignment: false,
      __buildVersion__: pkg.version,
    }),
    typescript({
      clean: true,
    }),
  ],
};
