// Definición de datos de conversión para diferentes actividades y géneros
const conversionData = {
  male: {
    // Calorías quemadas en Rower/SkiErg para hombres
    rowerSkiCal: [0, 5, 10, 15, 20, 25, 30, 40, 50, 60, 80, 100],
    // Calorías quemadas en BikeErg para hombres
    bikeErgCal: [0, 5, 10, 15, 20, 25, 30, 40, 50, 60, 80, 100],
    // Calorías quemadas en Assault Bike para hombres
    assaultBikeCal: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80],
    // Distancia corrida en metros para hombres
    runMeters: [0, 50, 100, 150, 200, 250, 300, 400, 500, 600, 800, 1000],
    // Distancia remada en metros para hombres
    rowerSkiMeters: [0, 63, 125, 188, 250, 313, 375, 500, 625, 750, 1000, 1250],
    // Distancia en BikeErg en metros para hombres
    bikeErgMeters: [0, 125, 250, 375, 500, 625, 750, 1000, 1250, 2000, 2500],
  },
  female: {
    // Calorías quemadas en Rower/SkiErg para mujeres
    rowerSkiCal: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80],
    // Calorías quemadas en BikeErg para mujeres
    bikeErgCal: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80],
    // Calorías quemadas en Assault Bike para mujeres
    assaultBikeCal: [0, 4, 6, 9, 12, 16, 20, 25, 32, 38, 51, 64],
    // Distancia corrida en metros para mujeres
    runMeters: [0, 50, 100, 150, 200, 250, 300, 400, 500, 600, 800, 1000],
    // Distancia remada en metros para mujeres
    rowerSkiMeters: [
      0, 56, 113, 169, 225, 270, 280, 338, 450, 563, 675, 900, 1125,
    ],
    // Distancia en BikeErg en metros para mujeres
    bikeErgMeters: [
      0, 113, 225, 338, 450, 563, 675, 900, 1125, 1250, 1800, 2250,
    ],
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
