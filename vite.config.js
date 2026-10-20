import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  // Rutas relativas en el build. Necesario para Capacitor: dentro del APK
  // el WebView carga los archivos desde el sistema de archivos local, donde
  // una ruta absoluta como /assets/index.js apunta a la raiz del dispositivo
  // y da pantalla en blanco. No afecta el deploy web: servido desde la raiz
  // del dominio, './assets/...' resuelve al mismo lugar que '/assets/...'.
  base: './',
  plugins: [
    react(),
    VitePWA({
      // Una version nueva se activa sola. Para una calculadora sin datos del
      // usuario en juego es lo correcto: no hay nada que perder al recargar,
      // y evita el error clasico de las PWA, donde el service worker sigue
      // sirviendo la version vieja desde su cache despues de un deploy.
      registerType: 'autoUpdate',

      // El registro se hace a mano en main.jsx, y solo en la web. Dentro del
      // APK un service worker no aporta nada (los archivos ya son locales) y
      // agrega una segunda capa de cache que puede servir codigo viejo
      // despues de actualizar la app.
      injectRegister: null,

      // El patron de globPatterns ya incluye todos los PNG de public/. Sin
      // esto, los iconos del manifiesto entraban dos veces al precache.
      includeManifestIcons: false,

      manifest: {
        name: 'Kalibra — Equivalencias de entrenamiento',
        short_name: 'Kalibra',
        description:
          'Convierte esfuerzos entre máquinas, calcula porcentajes de carga y estima tiempos de carrera.',
        lang: 'es',
        dir: 'ltr',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'portrait',
        // Mismo color que el fondo de la app: la pantalla de arranque que
        // arma el navegador con estos datos empalma sin destello.
        background_color: '#141414',
        theme_color: '#141414',
        categories: ['health', 'fitness', 'sports', 'utilities'],
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'pwa-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },

      workbox: {
        // Todo lo que la app necesita para funcionar sin conexion. Incluye la
        // foto de fondo (782 KB, por debajo del limite de 2 MB de Workbox) y
        // la tipografia empaquetada.
        globPatterns: ['**/*.{js,css,html,png,jpg,svg,woff2}'],
        // Los .woff son el respaldo para navegadores viejos; cualquier
        // navegador capaz de instalar una PWA usa woff2.
        globIgnores: ['**/*.woff'],
        // Borra caches de versiones anteriores del service worker.
        cleanupOutdatedCaches: true,
        // App de una sola pagina: cualquier navegacion sin red cae al index.
        navigateFallback: 'index.html',
      },
    }),
  ],
})
