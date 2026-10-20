import { useCallback, useEffect, useState } from 'react';

const PREFIJO = 'equivo:';

/**
 * Como useState, pero el valor sobrevive al cierre de la app.
 *
 * localStorage puede fallar o estar deshabilitado: modo incógnito, permisos
 * del WebView, almacenamiento lleno. Por eso cada acceso va envuelto en
 * try/catch y la app funciona igual si no se puede guardar nada: simplemente
 * arranca con el valor por defecto cada vez.
 *
 * @param {string} clave identificador de la preferencia
 * @param {*} valorInicial qué usar si no hay nada guardado
 */
export function usePreferencia(clave, valorInicial) {
  const claveCompleta = PREFIJO + clave;

  const [valor, setValor] = useState(() => {
    try {
      const guardado = window.localStorage.getItem(claveCompleta);
      return guardado === null ? valorInicial : JSON.parse(guardado);
    } catch {
      return valorInicial;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(claveCompleta, JSON.stringify(valor));
    } catch {
      // Si no se puede guardar, la app sigue andando con el valor en memoria.
    }
  }, [claveCompleta, valor]);

  return [valor, setValor];
}

/**
 * Copia un texto al portapapeles y avisa si salió bien.
 *
 * navigator.clipboard necesita contexto seguro. Capacitor sirve la app desde
 * https://localhost, así que ahí funciona, pero el método puede no existir en
 * WebViews viejos: en ese caso se cae al método antiguo con execCommand.
 *
 * @returns {[boolean, (texto: string) => Promise<void>]} si se copió recién, y la función
 */
export function useCopiar(milisegundos = 1800) {
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (!copiado) return undefined;
    const id = setTimeout(() => setCopiado(false), milisegundos);
    return () => clearTimeout(id);
  }, [copiado, milisegundos]);

  const copiar = useCallback(async texto => {
    const valor = String(texto ?? '');
    if (valor === '') return false;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(valor);
        setCopiado(true);
        return true;
      }
    } catch {
      // Sigue al método de respaldo.
    }

    try {
      const area = document.createElement('textarea');
      area.value = valor;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();

      // execCommand devuelve false cuando no pudo copiar, SIN lanzar
      // excepción. Ignorar ese valor hacía que la app mostrara "Copiado"
      // aunque el portapapeles hubiera quedado intacto.
      const exito = document.execCommand('copy');
      document.body.removeChild(area);

      if (exito) setCopiado(true);
      return exito;
    } catch {
      // Sin portapapeles disponible: no se avisa nada para no mentir.
      return false;
    }
  }, []);

  return [copiado, copiar];
}
