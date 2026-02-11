import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config(); // <<< CARGA .env

const HTTPS = process.env.VITE_USE_HTTPS == 1

let httpsConfig = null
let useHTTPS = false


if (HTTPS) {
  try {
    const certPath = process.env.VITE_HTTPS_CRT_SSL;
    const keyPath = process.env.VITE_HTTPS_KEY_SSL;

    const cert = fs.readFileSync(certPath);
    const key = fs.readFileSync(keyPath);

    httpsConfig = { cert, key };
    console.log('🚀 Dev server en HTTPS');
    useHTTPS = true
  } catch (err) {
    console.warn('⚠️ No se pudo levantar HTTPS, usando HTTP:', err.message);
  }
}

export default defineConfig({
  plugins: [react(), svgr()],
    server: {
    https: httpsConfig,
    port: 5173
  },
  define: {
    __DEV_SERVER_PROTOCOL__: JSON.stringify(useHTTPS ? 'https' : 'http')
  }
})
