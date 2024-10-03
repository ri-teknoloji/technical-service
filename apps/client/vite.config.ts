import generouted from "@generouted/react-router/plugin";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
  cacheDir: ".vite",
  plugins: [react(), generouted()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
