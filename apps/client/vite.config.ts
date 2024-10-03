import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import generouted from "@generouted/react-router/plugin";

export default defineConfig({
  cacheDir: ".vite",
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  plugins: [react(), generouted()],
});
