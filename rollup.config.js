import ts from "rollup-plugin-typescript2";
import terser from "rollup-plugin-terser-js";
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
