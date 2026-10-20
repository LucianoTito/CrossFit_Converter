import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  // Rutas relativas en el build. Necesario para Capacitor: dentro del APK
  // el WebView carga los archivos desde el sistema de archivos local, donde
  // una ruta absoluta como /assets/index.js apunta a la raiz del dispositivo
  // y da pantalla en blanco. No afecta el deploy web: servido desde la raiz
  // del dominio, './assets/...' resuelve al mismo lugar que '/assets/...'.
  base: './',
  plugins: [react()],
})
