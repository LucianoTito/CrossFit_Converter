// Tests de la lógica de conversión.
// Se corren con el runner nativo de Node (sin dependencias extra):
//   npm test
//
// Los valores esperados salen del chart oficial de CrossFit
// (CAP_CardioConversionCharts_v.1.pdf, páginas 3 y 4), que es la única fuente
// de conversion.js. Si algún día se cambia el chart de referencia, este
// archivo es el que hay que actualizar primero.
//
// El objetivo central es blindar la INVARIANTE de alineación por índice:
// todos los arrays de un género deben tener la misma longitud y corresponderse
// posición a posición con runMeters.

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { conversionData, convertCalories, convertMeters } from './conversion.js';

const GENEROS = ['male', 'female'];
const RUNS = [0, 50, 100, 150, 200, 250, 300, 400, 500, 600, 800, 1000];

// Proporciones de distancia del chart (pág. 4).
const FACTORES_METROS = {
  male: { rowerSkiMeters: 1.25, bikeErgMeters: 2.5, assaultBikeMeters: 3.125, echoBikeMeters: 3.125 },
  female: { rowerSkiMeters: 1.0, bikeErgMeters: 2.0, assaultBikeMeters: 2.1875, echoBikeMeters: 2.1875 },
};

// Filas textuales del chart (pág. 3 y 4), para verificar contra la fuente y no
// solo contra nuestras propias proporciones.
const FILAS_CHART = [
  // [run, genero, clave, valorEsperado]
  [200, 'female', 'rowerSkiMeters', 200], [200, 'male', 'rowerSkiMeters', 250],
  [400, 'female', 'rowerSkiMeters', 400], [400, 'male', 'rowerSkiMeters', 500],
  [800, 'female', 'rowerSkiMeters', 800], [800, 'male', 'rowerSkiMeters', 1000],
  [200, 'female', 'bikeErgMeters', 400], [200, 'male', 'bikeErgMeters', 500],
  [400, 'female', 'bikeErgMeters', 800], [400, 'male', 'bikeErgMeters', 1000],
  [800, 'female', 'bikeErgMeters', 1600], [800, 'male', 'bikeErgMeters', 2000],
  [400, 'female', 'assaultBikeMeters', 875], [400, 'male', 'assaultBikeMeters', 1250],
  [800, 'female', 'assaultBikeMeters', 1750], [800, 'male', 'assaultBikeMeters', 2500],
  [400, 'female', 'echoBikeMeters', 875], [400, 'male', 'echoBikeMeters', 1250],
  [800, 'female', 'echoBikeMeters', 1750], [800, 'male', 'echoBikeMeters', 2500],
  [200, 'female', 'rowerSkiCal', 12], [200, 'male', 'rowerSkiCal', 18],
  [400, 'female', 'rowerSkiCal', 25], [400, 'male', 'rowerSkiCal', 36],
  [600, 'female', 'rowerSkiCal', 36], [600, 'male', 'rowerSkiCal', 52],
  [800, 'female', 'rowerSkiCal', 50], [800, 'male', 'rowerSkiCal', 70],
  [200, 'female', 'assaultBikeCal', 12], [200, 'male', 'assaultBikeCal', 15],
  [400, 'female', 'assaultBikeCal', 24], [400, 'male', 'assaultBikeCal', 30],
  [600, 'female', 'assaultBikeCal', 36], [600, 'male', 'assaultBikeCal', 45],
  [800, 'female', 'assaultBikeCal', 48], [800, 'male', 'assaultBikeCal', 60],
  [200, 'female', 'echoBikeCal', 8], [200, 'male', 'echoBikeCal', 12],
  [400, 'female', 'echoBikeCal', 18], [400, 'male', 'echoBikeCal', 25],
  [600, 'female', 'echoBikeCal', 26], [600, 'male', 'echoBikeCal', 38],
  [800, 'female', 'echoBikeCal', 36], [800, 'male', 'echoBikeCal', 51],
];

describe('Estructura de conversionData', () => {
  test('ambos géneros exponen exactamente las mismas claves', () => {
    assert.deepEqual(
      Object.keys(conversionData.male).sort(),
      Object.keys(conversionData.female).sort(),
    );
  });

  test('están presentes las máquinas que espera la interfaz', () => {
    const esperadas = [
      'runMeters', 'rowerSkiMeters', 'bikeErgMeters',
      'assaultBikeMeters', 'echoBikeMeters',
      'rowerSkiCal', 'bikeErgCal', 'assaultBikeCal', 'echoBikeCal',
      'DU_Reps',
    ];
    for (const genero of GENEROS) {
      for (const clave of esperadas) {
        assert.ok(
          clave in conversionData[genero],
          `falta "${clave}" en ${genero}`,
        );
      }
    }
  });

  for (const genero of GENEROS) {
    test(`[${genero}] todos los arrays tienen la misma longitud`, () => {
      const esperada = conversionData[genero].runMeters.length;
      for (const [clave, valores] of Object.entries(conversionData[genero])) {
        assert.equal(
          valores.length,
          esperada,
          `"${clave}" tiene ${valores.length} elementos y debería tener ${esperada}. ` +
            'Las conversiones cruzan datos por índice: una longitud distinta ' +
            'desalinea todos los resultados desde ese punto.',
        );
      }
    });

    test(`[${genero}] todos los valores son enteros finitos y crecientes`, () => {
      for (const [clave, valores] of Object.entries(conversionData[genero])) {
        valores.forEach((v, i) => {
          assert.ok(Number.isInteger(v), `"${clave}[${i}]" no es entero: ${v}`);
          if (i > 0) {
            assert.ok(
              v > valores[i - 1],
              `"${clave}" no es estrictamente creciente en el índice ${i}: ` +
                `${valores[i - 1]} -> ${v}`,
            );
          }
        });
      }
    });

    test(`[${genero}] runMeters conserva los anclajes esperados`, () => {
      assert.deepEqual(conversionData[genero].runMeters, RUNS);
    });
  }
});

describe('Coincidencia con el chart oficial de CrossFit', () => {
  // Verifica contra los números impresos en el PDF, no contra nuestras
  // proporciones. Si alguien toca un array "para redondear mejor", esto falla.
  for (const [run, genero, clave, esperado] of FILAS_CHART) {
    test(`[${genero}] run ${run}m -> ${clave} = ${esperado}`, () => {
      assert.equal(convertMeters('runMeters', run, genero, clave), esperado);
    });
  }
});

describe('Proporciones de distancia', () => {
  for (const genero of GENEROS) {
    for (const [clave, factor] of Object.entries(FACTORES_METROS[genero])) {
      test(`[${genero}] run -> ${clave} respeta el factor x${factor}`, () => {
        for (const run of RUNS) {
          // convertValue() redondea, así que el esperado también.
          const esperado = Math.round(run * factor);
          assert.equal(
            convertMeters('runMeters', run, genero, clave),
            esperado,
            `run ${run}m debería dar ${esperado}m en ${clave}`,
          );
        }
      });
    }
  }

  test('las distancias de mujeres son menores que las de hombres', () => {
    // El chart diferencia metros por género. Este test documenta esa decisión:
    // si alguien vuelve a unificar los arrays, falla y obliga a revisarlo.
    for (const clave of Object.keys(FACTORES_METROS.male)) {
      for (const run of RUNS.filter(r => r > 0)) {
        const m = convertMeters('runMeters', run, 'male', clave);
        const f = convertMeters('runMeters', run, 'female', clave);
        assert.ok(f < m, `${clave} en run ${run}m: mujeres ${f} debería ser < hombres ${m}`);
      }
    }
  });

  test('Assault y Echo Bike coinciden en metros, como en el chart', () => {
    for (const genero of GENEROS) {
      assert.deepEqual(
        conversionData[genero].assaultBikeMeters,
        conversionData[genero].echoBikeMeters,
      );
    }
  });

  test('la conversión inversa vuelve al valor original', () => {
    for (const genero of GENEROS) {
      for (const clave of Object.keys(FACTORES_METROS[genero])) {
        for (const run of RUNS) {
          const ida = convertMeters('runMeters', run, genero, clave);
          const vuelta = convertMeters(clave, ida, genero, 'runMeters');
          assert.equal(vuelta, run, `${genero}/${clave}: ${run} -> ${ida} -> ${vuelta}`);
        }
      }
    }
  });
});

describe('Ninguna conversión devuelve NaN', () => {
  // Recorre TODAS las combinaciones de origen y destino con todos los valores
  // de la tabla. Es el test que atrapó el NaN de "run 1000m -> BikeErg" y que
  // atrapa cualquier bug futuro de la misma familia sin escribir nada nuevo.
  for (const genero of GENEROS) {
    test(`[${genero}] todas las combinaciones origen -> destino`, () => {
      const claves = Object.keys(conversionData[genero]);
      for (const origen of claves) {
        for (const destino of claves) {
          for (const valor of conversionData[genero][origen]) {
            const r = convertCalories(origen, valor, genero, destino);
            assert.ok(
              Number.isFinite(r),
              `${genero}: ${origen} ${valor} -> ${destino} devolvió ${r}`,
            );
          }
        }
      }
    });
  }
});

describe('Regresiones: los bugs que había en los datos', () => {
  test('♂ run 1000m -> BikeErg daba NaN, ahora da 2500', () => {
    assert.equal(convertMeters('runMeters', 1000, 'male', 'bikeErgMeters'), 2500);
  });

  test('♂ run 600m -> BikeErg daba 2000, ahora da 1500', () => {
    assert.equal(convertMeters('runMeters', 600, 'male', 'bikeErgMeters'), 1500);
  });

  test('♀ run 500m -> Rower/Ski daba 450, ahora da 500', () => {
    assert.equal(convertMeters('runMeters', 500, 'female', 'rowerSkiMeters'), 500);
  });

  test('♀ run 600m -> BikeErg daba 1250, ahora da 1200', () => {
    assert.equal(convertMeters('runMeters', 600, 'female', 'bikeErgMeters'), 1200);
  });
});

describe('Comportamiento general', () => {
  test('convertir una actividad a sí misma devuelve el mismo valor', () => {
    for (const genero of GENEROS) {
      for (const clave of Object.keys(conversionData[genero])) {
        for (const v of conversionData[genero][clave]) {
          assert.equal(convertMeters(clave, v, genero, clave), v);
        }
      }
    }
  });

  test('el cero se mantiene en cero', () => {
    for (const genero of GENEROS) {
      for (const destino of Object.keys(conversionData[genero])) {
        assert.equal(convertMeters('runMeters', 0, genero, destino), 0);
      }
    }
  });

  test('interpola entre dos puntos de la tabla', () => {
    // 350m no está en la tabla: cae entre 300 y 400.
    assert.equal(convertMeters('runMeters', 350, 'male', 'rowerSkiMeters'), 438);
    assert.equal(convertMeters('runMeters', 350, 'female', 'rowerSkiMeters'), 350);
  });

  test('las calorías también se diferencian por género', () => {
    for (const clave of ['rowerSkiCal', 'bikeErgCal', 'assaultBikeCal', 'echoBikeCal']) {
      assert.notDeepEqual(
        conversionData.male[clave],
        conversionData.female[clave],
        `${clave} debería diferenciarse por género`,
      );
    }
  });

  test('convierte entre máquinas sin pasar por carrera', () => {
    // 36 cal de Row en hombres equivalen a 400m de carrera, que son 1250m
    // de Assault Bike.
    assert.equal(convertCalories('rowerSkiCal', 36, 'male', 'assaultBikeMeters'), 1250);
    // Y 25 cal de Echo en hombres son también 400m de carrera.
    assert.equal(convertCalories('echoBikeCal', 25, 'male', 'runMeters'), 400);
  });
});
