// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 5173,
//     open: true
//   }
// })

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import path from "path";

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@src": path.resolve(__dirname, "src"),
//     },
//   },
//   server: {
//     port: 5173,
//     open: true,
//   },
// });

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import path from "path";

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@src": path.resolve(__dirname, "src"),
//     },
//     // 👇 ensures Vite/TS can auto-resolve index.tsx even when subfolders exist
//     extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
//   },
//   server: {
//     port: 5173,
//     open: true,
//   },
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsConfigPaths()],
});
