import terser from "rollup-plugin-terser-js";
import ts from '@rollup/plugin-typescript';

export default {
  input: "src/index.ts",
  output: {
    file: "dist/flashthem.js",
    format: "umd",
    path: "dist",
    name: "flashthem",
  },
  plugins: [ts(),
  // terser()
  ],
};
