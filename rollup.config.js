import terser from "rollup-plugin-terser-js";
import ts from '@rollup/plugin-typescript';

export default {
  input: "src/index.ts",
  output:[
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
  ],
  plugins: [ts(),
  // terser()
  ],
};
