import React from 'react'
import ReactDOM from 'react-dom/client'
import { Capacitor } from '@capacitor/core'
import App from './App.jsx'
// La tipografia se empaqueta con la app en lugar de pedirsela a Google
// en cada arranque: sin eso la app depende de la red para verse bien y
// Google recibe una visita cada vez que alguien la abre.
import '@fontsource/roboto-mono/latin-400.css'
import '@fontsource/roboto-mono/latin-700.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Service worker de la PWA: solo en la web.
//
// Dentro del APK no hace falta, porque los archivos ya viven en el telefono,
// y sumaria una segunda capa de cache capaz de servir codigo viejo despues de
// una actualizacion. El import es dinamico para que el codigo de registro ni
// siquiera se cargue en la plataforma nativa.
if (!Capacitor.isNativePlatform()) {
  import('virtual:pwa-register')
    .then(({ registerSW }) => registerSW({ immediate: true }))
    .catch(() => {
      // Sin service worker la app funciona igual, solo que sin modo offline.
    })
}
