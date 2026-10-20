// src/App.jsx
import { useCallback } from 'react';
import { FaArrowUp, FaLinkedin, FaRightFromBracket } from 'react-icons/fa6';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

import ConversorCalsCard from './components/pages/ConversorCalsCard';
import ConversorWeightCard from './components/pages/ConversorWeightCard';
import LengthConverterCard from './components/pages/LengthConverterCard';
import RunPacingCard from './components/pages/RunPacingCard';
import WeightPercentageCalculator from './components/pages/WeightPercentageCalculator';
import { useSalirDeLaApp } from './hooks/useSalirDeLaApp';
import './App.css';

const LINKEDIN =
  'https://www.linkedin.com/in/luciano-facundo-tito-cedr%C3%B3n/';

function App() {
  const { avisoVisible, salir } = useSalirDeLaApp();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dentro del APK, un enlace común intenta abrirse en el mismo WebView y
  // deja al usuario atrapado en LinkedIn sin forma de volver. Browser.open
  // lo manda a una Custom Tab del sistema, con su propio botón de cerrar.
  const abrirLinkedIn = useCallback(async event => {
    if (!Capacitor.isNativePlatform()) return; // En web, el <a> hace lo suyo.
    event.preventDefault();
    try {
      await Browser.open({ url: LINKEDIN });
    } catch {
      window.open(LINKEDIN, '_blank', 'noopener,noreferrer');
    }
  }, []);

  return (
    <div className="App">
      <div className="card">
        <WeightPercentageCalculator />
      </div>

      <div className="card">
        <ConversorWeightCard />
      </div>

      <div className="card">
        <ConversorCalsCard />
      </div>

      <div className="card">
        <RunPacingCard />
      </div>

      <div className="card">
        <LengthConverterCard />
      </div>

      <button
        type="button"
        onClick={scrollToTop}
        className="scroll-to-top"
        aria-label="Volver al inicio"
        title="Volver al inicio"
      >
        <FaArrowUp />
      </button>

      {/* El botón de salida solo aparece dentro de la app instalada: en el
          navegador no tiene ningún sentido cerrar una pestaña por su cuenta. */}
      {Capacitor.isNativePlatform() && (
        <div className="app-acciones">
          <button type="button" className="btn-secundario" onClick={salir}>
            <FaRightFromBracket />
            Salir de la app
          </button>
        </div>
      )}

      <footer className="app-footer">
        <div className="app-footer__creditos">
          <span>Creado por Luciano Tito</span>
          <a
            href={LINKEDIN}
            onClick={abrirLinkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="app-footer__link"
            aria-label="Perfil de LinkedIn de Luciano Tito"
          >
            <FaLinkedin />
          </a>
        </div>
      </footer>

      {avisoVisible && (
        <div className="toast" role="status" aria-live="polite">
          Presioná atrás de nuevo para salir
        </div>
      )}
    </div>
  );
}

export default App;
