// Datos de conversión entre actividades, por género.
//
// FUENTE ÚNICA: "CrossFit Affiliate Programming — Machine Conversions",
// páginas 3 (CALORIES) y 4 (METERS) de:
// https://assets.crossfit.com/affiliates/CAP_CardioConversionCharts_v.1.pdf
//
// Todos los valores de este archivo salen de ese chart. Es importante que sea
// UNA sola fuente: las conversiones cruzan cualquier actividad contra
// cualquier otra, así que mezclar escalas de distintos charts produce
// resultados incoherentes al convertir, por ejemplo, Row cal -> Echo cal.
//
// INVARIANTE: todos los arrays de un mismo género deben tener la MISMA
// longitud y estar alineados por índice contra runMeters. convertValue() cruza
// los datos con targetData[sourceData.indexOf(x)], así que un elemento de más
// o de menos desalinea todas las conversiones desde ese punto.
// conversion.test.js verifica esta invariante.
//
// PROPORCIONES DE DISTANCIA (chart, pág. 4). Sí se diferencian por género:
//                    mujeres   hombres
//   Row / SkiErg      x1.0      x1.25
//   BikeErg (C2)      x2.0      x2.5
//   Assault / Echo    x2.1875   x3.125
//
// Las columnas de Assault Bike y Echo Bike son idénticas en metros, pero se
// mantienen como claves separadas para que el desplegable pueda nombrar la
// máquina que el usuario tiene y para poder diferenciarlas si el chart cambia.
//
// INTERPOLACIÓN: el chart ancla en 200, 400, 600, 800 y 1200 m de carrera.
// Los puntos intermedios de esta tabla (50, 100, 150, 250, 300, 500, 1000) se
// interpolan linealmente entre esos anclajes y se redondean.
//
// LÍMITE CONOCIDO: a partir de los 1600 m de carrera el chart baja la
// proporción de Assault/Echo (de x3.125 a x2.8125 en hombres). Esta tabla
// llega hasta 1000 m, donde la proporción del tramo corto todavía aplica; el
// valor de 1000 m queda unos 45 m por encima de lo que daría interpolar hacia
// el tramo siguiente. Si algún día se extiende la tabla más allá de 1600 m,
// hay que modelar ese quiebre.
export const conversionData = {
  male: {
    // --- CALORÍAS (chart pág. 3, columna ♂) ---
    rowerSkiCal: [0, 5, 9, 14, 18, 23, 27, 36, 44, 52, 70, 85],
    bikeErgCal: [0, 5, 9, 14, 18, 23, 27, 36, 44, 52, 70, 85],
    assaultBikeCal: [0, 4, 8, 11, 15, 19, 23, 30, 38, 45, 60, 75],
    echoBikeCal: [0, 3, 6, 9, 12, 15, 19, 25, 32, 38, 51, 64],

    // --- METROS (chart pág. 4, columna ♂) ---
    runMeters: [0, 50, 100, 150, 200, 250, 300, 400, 500, 600, 800, 1000],
    rowerSkiMeters: [0, 63, 125, 188, 250, 313, 375, 500, 625, 750, 1000, 1250],
    bikeErgMeters: [
      0, 125, 250, 375, 500, 625, 750, 1000, 1250, 1500, 2000, 2500,
    ],
    assaultBikeMeters: [
      0, 156, 313, 469, 625, 781, 938, 1250, 1563, 1875, 2500, 3125,
    ],
    echoBikeMeters: [
      0, 156, 313, 469, 625, 781, 938, 1250, 1563, 1875, 2500, 3125,
    ],

    // --- OTROS ---
    // Los saltos dobles no figuran en el chart de CrossFit; se conservan los
    // valores que ya tenía la app.
    DU_Reps: [0, 22, 45, 67, 90, 112, 135, 180, 225, 270, 360, 450],
  },

  female: {
    // --- CALORÍAS (chart pág. 3, columna ♀) ---
    rowerSkiCal: [0, 3, 6, 9, 12, 15, 19, 25, 31, 36, 50, 60],
    bikeErgCal: [0, 3, 6, 9, 12, 15, 19, 25, 31, 36, 50, 60],
    assaultBikeCal: [0, 3, 6, 9, 12, 15, 18, 24, 30, 36, 48, 62],
    echoBikeCal: [0, 2, 4, 6, 8, 11, 13, 18, 22, 26, 36, 45],

    // --- METROS (chart pág. 4, columna ♀) ---
    runMeters: [0, 50, 100, 150, 200, 250, 300, 400, 500, 600, 800, 1000],
    // El chart da Row/Ski = Run 1:1 para mujeres, de ahí que este array
    // coincida con runMeters. No es un error de carga.
    rowerSkiMeters: [0, 50, 100, 150, 200, 250, 300, 400, 500, 600, 800, 1000],
    bikeErgMeters: [0, 100, 200, 300, 400, 500, 600, 800, 1000, 1200, 1600, 2000],
    assaultBikeMeters: [
      0, 109, 219, 328, 438, 547, 656, 875, 1094, 1313, 1750, 2188,
    ],
    echoBikeMeters: [
      0, 109, 219, 328, 438, 547, 656, 875, 1094, 1313, 1750, 2188,
    ],

    // --- OTROS ---
    DU_Reps: [0, 22, 45, 67, 90, 112, 135, 180, 225, 270, 360, 450],
  },
};

// Función de interpolación lineal
const interpolate = (x1, y1, x2, y2, x) => {
  if (x1 === x2) return y1; // Evitar división por cero
  return y1 + ((x - x1) * (y2 - y1)) / (x2 - x1);
};

// Función para encontrar los puntos circundantes más cercanos para la interpolación
const findSurroundingPoints = (data, value) => {
  let lowerIndex = 0;
  let upperIndex = data.length - 1;
  for (let i = 0; i < data.length; i++) {
    if (data[i] >= value) {
      upperIndex = i;
      lowerIndex = i === 0 ? 0 : i - 1;
      break;
    }
  }
  if (upperIndex === lowerIndex) {
    lowerIndex = Math.max(0, lowerIndex - 1);
  }
  return [data[lowerIndex], data[upperIndex]];
};

// Función para convertir calorías de una actividad a otra usando interpolación
export function convertCalories(activity, value, gender, targetActivity) {
  const sourceData = conversionData[gender][activity];
  const targetData = conversionData[gender][targetActivity];
  return convertValue(sourceData, targetData, value);
}

// Función para convertir metros de una actividad a otra usando interpolación
export function convertMeters(activity, value, gender, targetActivity) {
  const sourceData = conversionData[gender][activity];
  const targetData = conversionData[gender][targetActivity];
  return convertValue(sourceData, targetData, value);
}

// Función principal para convertir el valor usando interpolación lineal entre dos puntos
const convertValue = (sourceData, targetData, value) => {
  const [x1, x2] = findSurroundingPoints(sourceData, value);
  const [y1, y2] = [
    targetData[sourceData.indexOf(x1)],
    targetData[sourceData.indexOf(x2)],
  ];
  return Math.round(interpolate(x1, y1, x2, y2, value));
};
