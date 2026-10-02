import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      // Bootstrap 5.3 still uses @import and legacy Sass functions; silence those warnings.
      scss: { quietDeps: true, silenceDeprecations: ["import", "global-builtin", "color-functions", "if-function"] },
    },
  },
});
