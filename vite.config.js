import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target:
          "https://wapfi-backend-service-staging-718658406507.europe-west1.run.app",
        changeOrigin: true,
        secure: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": [
            "react",
            "react-dom",
            "react-router-dom",
            "react-is",
          ],
          "vendor-charts": ["recharts"],
          "vendor-i18n": ["i18next", "react-i18next", "i18next-http-backend"],
          "vendor-forms": ["react-hook-form", "@hookform/resolvers", "yup"],
          "vendor-misc": [
            "axios",
            "react-toastify",
            "react-datepicker",
            "date-fns",
          ],
        },
      },
    },
  },
});

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";
// import fs from "fs";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   server: {
//     https: {
//       key: fs.readFileSync("./localhost-key.pem"),
//       cert: fs.readFileSync("./localhost.pem"),
//     },
//     host: "localhost",
//     port: 5173,
//   },
// });
