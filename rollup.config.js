import ts from "@rollup/plugin-typescript";
import terser from "rollup-plugin-terser-js";
export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/flashthem.js",
      format: "umd",
      name: "flashthem",
    },
    {
      file: "lib/index.cmd.js",
      format: "cjs",
      name: "flashthem",
    },
    {
      file: "lib/index.umd.js",
      format: "umd",
      name: "flashthem",
    },
    {
      file: "lib/index.esm.js",
      format: "es",
      name: "flashthem",
    },

    {
      file: "doc/src/lib/index.esm.js",
      format: "es",
      name: "flashthem",
    },
    {
      file: "doc/lib/index.esm.js",
      format: "es",
      name: "flashthem",
    },
    {
      file: "doc/lib/index.umd.js",
      format: "umd",
      name: "flashthem",
    },
  ],
  plugins: [terser(), ts()],
};
