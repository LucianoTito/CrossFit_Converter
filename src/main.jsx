import React from 'react'
import ReactDOM from 'react-dom/client'
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
