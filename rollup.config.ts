import type { RollupOptions } from "rollup";
import esbuild from "rollup-plugin-esbuild";
import { terser } from "rollup-plugin-terser";
import dts from "rollup-plugin-dts";

const config: RollupOptions[] = [
  {
    input: "lib/index.ts",
    plugins: [esbuild(), terser()],
    output: [
      {
        file: `dist/cjs/alias-classname.js`,
        format: "cjs",
        exports: "named",
        strict: false,
      },
      {
        file: `dist/esm/alias-classname.mjs`,
        format: "es",
      },
    ],
  },
  {
    input: "lib/index.ts",
    plugins: [dts()],
    output: {
      file: `dist/alias-classname.d.ts`,
      format: "es",
    },
  },
];

export default config;
