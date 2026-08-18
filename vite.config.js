import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    // sem sourcemap em produção: build menor e mais rápido
    sourcemap: false,
  },
});
