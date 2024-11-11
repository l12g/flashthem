import { defineConfig } from "vite";
import md from "./plugins/md";
export default defineConfig({
  plugins: [md()],
});
