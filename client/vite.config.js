import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs';


// https://vite.dev/config/
export default defineConfig({
  server:{
    https: {
      key: fs.readFileSync('../localhost-key.pem'),
      cert: fs.readFileSync('../localhost.pem'),
    },
     proxy:{
      '/api': {
        target:"https://localhost:5000",
       changeOrigin: true,
        secure: false, // ✅ self-signed cert ke liye
     }
    }
  },
  plugins: [
    react(),
      tailwindcss(),
  ],
})
