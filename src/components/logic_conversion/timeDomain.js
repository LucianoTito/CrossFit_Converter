// Rango de tiempo esperado ("time domain") para una distancia de carrera.
//
// FUENTE: la columna "Time Domain" de las dos tablas de
// "CrossFit Affiliate Programming — Machine Conversions", páginas 3 y 4 de
// https://assets.crossfit.com/affiliates/CAP_CardioConversionCharts_v.1.pdf
//
// El chart no publica un time domain para cada distancia, sino para unas
// pocas de referencia. Acá se interpola linealmente entre esos anclajes, que
// es el mismo criterio que usa conversion.js para las equivalencias.
//
// Para qué sirve: una conversión dice "400m de carrera equivalen a 1000m de
// BikeErg", pero no dice si ese tramo debería durar un minuto o cinco. El time
// domain da esa referencia al programar un WOD.
//
// Las dos páginas difieren levemente en dos filas (1600m figura como 7:00-8:00
// en metros y 7:00-9:00 en calorías; 5000m como 17:00-20:00 y 17:00-22:00).
// Se toman los valores de la página de METROS, que es la fuente de la tabla de
// distancias de la app.

// [metros, segundosMinimo, segundosMaximo]
const ANCLAJES = [
  [0, 0, 0],
  [200, 45, 60], // :45 - 1:00
  [400, 90, 120], // 1:30 - 2:00
  [600, 150, 180], // 2:30 - 3:00   (pág. de calorías)
  [800, 210, 240], // 3:30 - 4:00
  [1200, 300, 360], // 5:00 - 6:00  (pág. de calorías)
  [1600, 420, 480], // 7:00 - 8:00
  [5000, 1020, 1200], // 17:00 - 20:00
  [10000, 2400, 3000], // 40:00 - 50:00
];

const interpolar = (x, x1, y1, x2, y2) => {
  if (x1 === x2) return y1;
  return y1 + ((x - x1) * (y2 - y1)) / (x2 - x1);
};

/**
 * Rango de tiempo esperado para una distancia corrida.
 * @param {number} metros
 * @returns {{min: number, max: number}|null} segundos, o null si no aplica
 */
export function timeDomainCarrera(metros) {
  if (!Number.isFinite(metros) || metros <= 0) return null;

  // Más allá del último anclaje no se extrapola: el chart no lo respalda y un
  // ritmo sostenido no escala linealmente en distancias muy largas.
  const ultimo = ANCLAJES[ANCLAJES.length - 1];
  if (metros > ultimo[0]) return null;

  for (let i = 1; i < ANCLAJES.length; i++) {
    const [x2, min2, max2] = ANCLAJES[i];
    if (metros <= x2) {
      const [x1, min1, max1] = ANCLAJES[i - 1];
      return {
        min: Math.round(interpolar(metros, x1, min1, x2, min2)),
        max: Math.round(interpolar(metros, x1, max1, x2, max2)),
      };
    }
  }
  return null;
}

/**
 * El time domain ya formateado, listo para mostrar.
 * @param {number} metros
 * @returns {string} por ejemplo "1:30 - 2:00", o '' si no aplica
 */
export function timeDomainFormateado(metros) {
  const rango = timeDomainCarrera(metros);
  if (!rango) return '';

  const fmt = segundos => {
    const total = Math.round(segundos);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return `${fmt(rango.min)} - ${fmt(rango.max)}`;
}
