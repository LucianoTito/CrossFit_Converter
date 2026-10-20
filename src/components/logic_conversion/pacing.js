// Cálculo de ritmos y tiempos de carrera.
//
// FUENTE: "CrossFit Affiliate Programming — Run Pacing", página 1 de
// https://assets.crossfit.com/affiliates/CAP_CardioConversionCharts_v.1.pdf
//
// El chart publica una tabla de ritmos (:20 a :36 por cada 100m) contra
// distancias fijas. Al verificar los valores se comprueba que la relación es
// estrictamente lineal: tiempo = ritmo x (distancia / 100). Por ejemplo, a
// :22/100m el chart da 18:20 para 5000m, que es exactamente 50 x 22s.
//
// Por eso acá se implementa la fórmula en lugar de copiar la tabla: cubre
// cualquier ritmo y cualquier distancia, no solo las filas impresas, y no
// introduce una tabla más que pueda desalinearse. Los tests verifican la
// fórmula contra los valores publicados.

// Distancias que muestra el chart, más 100m y 2000m que son habituales en WODs.
export const DISTANCIAS_ESTANDAR = [
  100, 200, 400, 800, 1000, 1600, 2000, 3200, 5000,
];

// Rango de ritmos razonable para la interfaz, en segundos por 100m.
export const RITMO_MIN = 15; // 2:30/km — muy rápido
export const RITMO_MAX = 60; // 10:00/km — caminata

/**
 * Tiempo total para una distancia, dado un ritmo por 100m.
 * @param {number} ritmoPor100m segundos por cada 100 metros
 * @param {number} metros distancia en metros
 * @returns {number} segundos totales
 */
export function tiempoParaDistancia(ritmoPor100m, metros) {
  if (!Number.isFinite(ritmoPor100m) || !Number.isFinite(metros)) return NaN;
  if (ritmoPor100m <= 0 || metros < 0) return NaN;
  return (ritmoPor100m * metros) / 100;
}

/**
 * Ritmo por 100m implícito en un tiempo y una distancia.
 * @param {number} segundos tiempo total
 * @param {number} metros distancia en metros
 * @returns {number} segundos por cada 100 metros
 */
export function ritmoDesdeTiempo(segundos, metros) {
  if (!Number.isFinite(segundos) || !Number.isFinite(metros)) return NaN;
  if (metros <= 0 || segundos < 0) return NaN;
  return (segundos * 100) / metros;
}

/**
 * Ritmo por kilómetro, que es como lo piensa mucha gente que corre.
 * @param {number} ritmoPor100m segundos por cada 100 metros
 * @returns {number} segundos por kilómetro
 */
export function ritmoPorKm(ritmoPor100m) {
  if (!Number.isFinite(ritmoPor100m) || ritmoPor100m <= 0) return NaN;
  return ritmoPor100m * 10;
}

/**
 * Formatea segundos como mm:ss, o h:mm:ss si pasa de una hora.
 * Redondea al segundo: los tiempos del chart son todos enteros.
 * @param {number} segundos
 * @returns {string}
 */
export function formatearTiempo(segundos) {
  if (!Number.isFinite(segundos) || segundos < 0) return '';

  const total = Math.round(segundos);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;

  const dosDigitos = n => String(n).padStart(2, '0');

  if (h > 0) return `${h}:${dosDigitos(m)}:${dosDigitos(s)}`;
  return `${m}:${dosDigitos(s)}`;
}

/**
 * Interpreta un tiempo escrito por el usuario.
 * Acepta "20", ":20", "1:20", "1:23:45" y espacios alrededor.
 * @param {string|number} texto
 * @returns {number} segundos, o NaN si no se puede interpretar
 */
export function parsearTiempo(texto) {
  if (typeof texto === 'number') {
    return Number.isFinite(texto) && texto >= 0 ? texto : NaN;
  }
  if (typeof texto !== 'string') return NaN;

  const limpio = texto.trim();
  if (limpio === '') return NaN;

  // ":20" se escribe así en los charts y significa 20 segundos.
  const partes = (limpio.startsWith(':') ? '0' + limpio : limpio).split(':');
  if (partes.length > 3) return NaN;

  const numeros = partes.map(p => (p === '' ? NaN : Number(p)));
  if (numeros.some(n => !Number.isFinite(n) || n < 0)) return NaN;

  // Sin dos puntos: son segundos sueltos.
  if (numeros.length === 1) return numeros[0];
  // mm:ss — los segundos no pueden pasar de 59.
  if (numeros.length === 2) {
    if (numeros[1] >= 60) return NaN;
    return numeros[0] * 60 + numeros[1];
  }
  // h:mm:ss
  if (numeros[1] >= 60 || numeros[2] >= 60) return NaN;
  return numeros[0] * 3600 + numeros[1] * 60 + numeros[2];
}

/**
 * Tabla de tiempos para las distancias estándar, dado un ritmo.
 * @param {number} ritmoPor100m segundos por cada 100 metros
 * @param {number[]} [distancias] distancias a calcular
 * @returns {{metros: number, segundos: number, tiempo: string}[]}
 */
export function tablaDePacing(ritmoPor100m, distancias = DISTANCIAS_ESTANDAR) {
  if (!Number.isFinite(ritmoPor100m) || ritmoPor100m <= 0) return [];

  return distancias.map(metros => {
    const segundos = tiempoParaDistancia(ritmoPor100m, metros);
    return { metros, segundos, tiempo: formatearTiempo(segundos) };
  });
}
