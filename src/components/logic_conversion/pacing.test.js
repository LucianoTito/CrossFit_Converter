// Tests de pacing y time domain.
//
// El bloque principal verifica la fórmula de pacing contra la tabla impresa en
// el chart RUN PACING de CrossFit (página 1). Si esos 63 casos pasan, la
// fórmula reproduce el chart exactamente y además cubre ritmos y distancias
// que el chart no lista.

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  DISTANCIAS_ESTANDAR,
  formatearTiempo,
  parsearTiempo,
  ritmoDesdeTiempo,
  ritmoPorKm,
  tablaDePacing,
  tiempoParaDistancia,
} from './pacing.js';
import { timeDomainCarrera, timeDomainFormateado } from './timeDomain.js';

// Tabla textual del chart: ritmo por 100m -> tiempos publicados.
// Columnas: 200m, 400m, 800m, 1000m, 1600m, 3200m, 5000m
const CHART_PACING = {
  20: [':40', '1:20', '2:40', '3:20', '5:20', '10:40', '16:40'],
  22: [':44', '1:28', '2:56', '3:40', '5:52', '11:44', '18:20'],
  24: [':48', '1:36', '3:12', '4:00', '6:24', '12:48', '20:00'],
  26: [':52', '1:44', '3:28', '4:20', '6:56', '13:52', '21:40'],
  28: [':56', '1:52', '3:44', '4:40', '7:28', '14:56', '23:20'],
  30: ['1:00', '2:00', '4:00', '5:00', '8:00', '16:00', '25:00'],
  32: ['1:04', '2:08', '4:16', '5:20', '8:32', '17:04', '26:40'],
  34: ['1:08', '2:16', '4:32', '5:40', '9:04', '18:08', '28:20'],
  36: ['1:12', '2:24', '4:48', '6:00', '9:36', '19:12', '30:00'],
};
const COLUMNAS_CHART = [200, 400, 800, 1000, 1600, 3200, 5000];

describe('Pacing: coincidencia con el chart RUN PACING de CrossFit', () => {
  for (const [ritmoStr, fila] of Object.entries(CHART_PACING)) {
    const ritmo = Number(ritmoStr);
    test(`ritmo :${ritmo}/100m reproduce la fila completa del chart`, () => {
      COLUMNAS_CHART.forEach((metros, i) => {
        const esperado = parsearTiempo(fila[i]);
        const obtenido = tiempoParaDistancia(ritmo, metros);
        assert.equal(
          obtenido,
          esperado,
          `a :${ritmo}/100m, ${metros}m deberia dar ${fila[i]} ` +
            `(${esperado}s) y dio ${formatearTiempo(obtenido)} (${obtenido}s)`,
        );
      });
    });
  }
});

describe('Pacing: cálculo', () => {
  test('la relación es lineal con la distancia', () => {
    assert.equal(tiempoParaDistancia(30, 100), 30);
    assert.equal(tiempoParaDistancia(30, 200), 60);
    assert.equal(tiempoParaDistancia(30, 400), 120);
  });

  test('admite ritmos y distancias fuera de la tabla del chart', () => {
    // :21.5/100m en 1500m: ritmos y distancias que el chart no lista.
    assert.equal(tiempoParaDistancia(21.5, 1500), 322.5);
    assert.equal(formatearTiempo(322.5), '5:23');
  });

  test('ritmo y tiempo son inversos', () => {
    for (const metros of DISTANCIAS_ESTANDAR) {
      for (const ritmo of [18, 25, 33, 47]) {
        const t = tiempoParaDistancia(ritmo, metros);
        assert.ok(
          Math.abs(ritmoDesdeTiempo(t, metros) - ritmo) < 1e-9,
          `${metros}m a :${ritmo} no vuelve al mismo ritmo`,
        );
      }
    }
  });

  test('el ritmo por kilómetro son diez veces el de 100m', () => {
    assert.equal(ritmoPorKm(30), 300);
    assert.equal(formatearTiempo(ritmoPorKm(30)), '5:00');
  });

  test('las entradas inválidas devuelven NaN, no un número cualquiera', () => {
    for (const malo of [0, -5, NaN, Infinity, 'rápido', null, undefined]) {
      assert.ok(
        Number.isNaN(tiempoParaDistancia(malo, 400)),
        `ritmo ${malo} deberia dar NaN`,
      );
    }
    assert.ok(Number.isNaN(tiempoParaDistancia(30, -100)));
  });

  test('la tabla cubre todas las distancias estándar', () => {
    const tabla = tablaDePacing(30);
    assert.equal(tabla.length, DISTANCIAS_ESTANDAR.length);
    assert.deepEqual(
      tabla.map(f => f.metros),
      DISTANCIAS_ESTANDAR,
    );
    assert.equal(tabla.find(f => f.metros === 5000).tiempo, '25:00');
  });

  test('un ritmo inválido devuelve tabla vacía, no una tabla de NaN', () => {
    assert.deepEqual(tablaDePacing(0), []);
    assert.deepEqual(tablaDePacing(NaN), []);
  });
});

describe('Pacing: formato de tiempo', () => {
  test('formatea mm:ss', () => {
    assert.equal(formatearTiempo(0), '0:00');
    assert.equal(formatearTiempo(9), '0:09');
    assert.equal(formatearTiempo(60), '1:00');
    assert.equal(formatearTiempo(125), '2:05');
    assert.equal(formatearTiempo(3599), '59:59');
  });

  test('pasa a h:mm:ss después de una hora', () => {
    assert.equal(formatearTiempo(3600), '1:00:00');
    assert.equal(formatearTiempo(3725), '1:02:05');
  });

  test('redondea al segundo', () => {
    assert.equal(formatearTiempo(59.4), '0:59');
    assert.equal(formatearTiempo(59.6), '1:00');
  });

  test('devuelve vacío ante valores sin sentido', () => {
    for (const malo of [NaN, -1, Infinity, 'x']) {
      assert.equal(formatearTiempo(malo), '');
    }
  });
});

describe('Pacing: interpretación de lo que escribe el usuario', () => {
  test('acepta los formatos habituales', () => {
    assert.equal(parsearTiempo('20'), 20);
    assert.equal(parsearTiempo(':20'), 20); // como lo escribe el chart
    assert.equal(parsearTiempo('1:20'), 80);
    assert.equal(parsearTiempo('1:23:45'), 5025);
    assert.equal(parsearTiempo('  2:30  '), 150);
    assert.equal(parsearTiempo(45), 45);
  });

  test('rechaza lo que no es un tiempo', () => {
    for (const malo of ['', 'abc', '1:2:3:4', '1:60', '1:00:60', '-5', ':', null]) {
      assert.ok(
        Number.isNaN(parsearTiempo(malo)),
        `"${malo}" deberia ser NaN`,
      );
    }
  });

  test('formatear y parsear son inversos', () => {
    for (const s of [0, 45, 60, 125, 3600, 5025]) {
      assert.equal(parsearTiempo(formatearTiempo(s)), s);
    }
  });
});

describe('Time domain', () => {
  test('coincide con los anclajes publicados en el chart', () => {
    const CHART = [
      [200, 45, 60],
      [400, 90, 120],
      [600, 150, 180],
      [800, 210, 240],
      [1200, 300, 360],
      [1600, 420, 480],
      [5000, 1020, 1200],
      [10000, 2400, 3000],
    ];
    for (const [metros, min, max] of CHART) {
      assert.deepEqual(
        timeDomainCarrera(metros),
        { min, max },
        `${metros}m no coincide con el chart`,
      );
    }
  });

  test('interpola entre anclajes', () => {
    // 1000m cae entre 800 (3:30-4:00) y 1200 (5:00-6:00).
    assert.deepEqual(timeDomainCarrera(1000), { min: 255, max: 300 });
    assert.equal(timeDomainFormateado(1000), '4:15 - 5:00');
  });

  test('el mínimo siempre es menor que el máximo', () => {
    for (let m = 50; m <= 10000; m += 50) {
      const r = timeDomainCarrera(m);
      assert.ok(r.min < r.max, `${m}m: min ${r.min} no es menor que max ${r.max}`);
    }
  });

  test('crece con la distancia', () => {
    let previo = 0;
    for (let m = 100; m <= 10000; m += 100) {
      const r = timeDomainCarrera(m);
      assert.ok(r.min > previo, `${m}m no aumenta respecto de la distancia anterior`);
      previo = r.min;
    }
  });

  test('no extrapola más allá del chart', () => {
    assert.equal(timeDomainCarrera(10001), null);
    assert.equal(timeDomainFormateado(15000), '');
  });

  test('devuelve null ante entradas sin sentido', () => {
    for (const malo of [0, -100, NaN, Infinity, 'x', null]) {
      assert.equal(timeDomainCarrera(malo), null);
    }
  });

  test('cubre el rango de distancias que usa la app', () => {
    for (const m of [50, 100, 150, 200, 250, 300, 400, 500, 600, 800, 1000]) {
      assert.notEqual(timeDomainFormateado(m), '', `falta time domain para ${m}m`);
    }
  });
});
