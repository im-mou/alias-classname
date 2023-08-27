import { resolve } from "path";
import dts from "vite-plugin-dts";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "lib/index.ts"),
      name: "alias-classname",
      fileName: (format) => `index.${format}.js`,
    },
  },
  plugins: [dts()],
});
