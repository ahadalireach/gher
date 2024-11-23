import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  base: "/", // Set to "/" for root deployment or "/sub-path/" for subdirectory deployment
  build: {
    outDir: "dist", // Output directory for the build
  },
});
