import { useCallback, useEffect, useRef, useState } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

/**
 * Maneja el botón atrás de Android y la salida de la aplicación.
 *
 * Sin esto, el botón atrás cierra la app de golpe en cuanto no hay historial
 * que recorrer, sin ningún aviso. El patrón que se usa acá —tocar una vez
 * muestra un aviso, tocar de nuevo sale— es el estándar de hecho en Android
 * para apps de una sola pantalla.
 *
 * Nada de esto corre en el navegador: `addListener` solo tiene efecto en la
 * plataforma nativa, así que `npm run dev` sigue comportándose como siempre.
 *
 * @param {number} ventanaMs cuánto tiempo vale el primer toque
 * @returns {{avisoVisible: boolean, salir: () => void}}
 */
export function useSalirDeLaApp(ventanaMs = 2000) {
  const [avisoVisible, setAvisoVisible] = useState(false);
  // En una ref y no en estado: el listener nativo se registra una sola vez y
  // leería para siempre el valor de la primera renderización.
  const esperandoConfirmacion = useRef(false);

  const salir = useCallback(() => {
    if (Capacitor.isNativePlatform()) {
      CapacitorApp.exitApp();
    }
  }, []);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return undefined;

    let temporizador;
    let quitar;

    const manejar = ({ canGoBack }) => {
      // Si hay historial dentro del WebView, el botón atrás debe navegar,
      // que es lo que el usuario espera.
      if (canGoBack) {
        window.history.back();
        return;
      }

      if (esperandoConfirmacion.current) {
        CapacitorApp.exitApp();
        return;
      }

      esperandoConfirmacion.current = true;
      setAvisoVisible(true);
      temporizador = setTimeout(() => {
        esperandoConfirmacion.current = false;
        setAvisoVisible(false);
      }, ventanaMs);
    };

    // addListener devuelve una promesa: hay que esperarla para poder quitar
    // el listener al desmontar, o queda registrado de más.
    const pendiente = CapacitorApp.addListener('backButton', manejar).then(
      handle => {
        quitar = () => handle.remove();
        return handle;
      },
    );

    return () => {
      clearTimeout(temporizador);
      if (quitar) quitar();
      else pendiente.then(handle => handle.remove()).catch(() => {});
    };
  }, [ventanaMs]);

  return { avisoVisible, salir };
}
