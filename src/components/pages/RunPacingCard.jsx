// src/components/pages/RunPacingCard.jsx
import { useMemo, useState } from 'react';
import { FaCheck, FaRegCopy } from 'react-icons/fa6';
import {
  formatearTiempo,
  parsearTiempo,
  ritmoPorKm,
  tablaDePacing,
  RITMO_MAX,
  RITMO_MIN,
} from '../logic_conversion/pacing';
import { usePreferencia, useCopiar } from '../../hooks/usePreferencia';
import '../styles/RunPacingCard.css';

// Un mismo ritmo se escribe distinto según la unidad: 30 segundos por 100m
// son 5:00 por kilómetro. El valor por defecto y el formato del campo tienen
// que seguir al modo, o el número queda interpretado en la unidad equivocada.
const POR_DEFECTO = { '100m': '30', km: '5:00' };

const formatearSegunModo = (segundos, modo) =>
  modo === 'km' ? formatearTiempo(segundos) : String(Math.round(segundos));

const RunPacingCard = () => {
  // El modo se declara primero: el valor inicial del campo depende de él.
  // Como se persiste, al reabrir la app puede venir en 'km', y arrancar con
  // "30" ahí significaría 30 segundos por kilómetro: un ritmo imposible que
  // dejaba la tarjeta sin resultados hasta cambiar el número a mano.
  const [modo, setModo] = usePreferencia('pacing:modo', '100m');

  // Se guarda como texto para no pelear con el campo mientras se escribe:
  // "1:" es un estado intermedio válido que como número no existe.
  const [ritmoTexto, setRitmoTexto] = useState(
    () => POR_DEFECTO[modo] ?? POR_DEFECTO['100m'],
  );
  const [copiado, copiar] = useCopiar();

  // Al cambiar de unidad se convierte el valor en pantalla en lugar de
  // dejarlo como está: el ritmo que el usuario eligió no cambió, solo cambia
  // cómo se expresa.
  const cambiarModo = nuevoModo => {
    const segundos = parsearTiempo(ritmoTexto);
    if (Number.isFinite(segundos) && segundos > 0) {
      const convertido = nuevoModo === 'km' ? segundos * 10 : segundos / 10;
      setRitmoTexto(formatearSegunModo(convertido, nuevoModo));
    } else {
      setRitmoTexto(POR_DEFECTO[nuevoModo] ?? POR_DEFECTO['100m']);
    }
    setModo(nuevoModo);
  };

  const ritmoPor100m = useMemo(() => {
    const segundos = parsearTiempo(ritmoTexto);
    if (!Number.isFinite(segundos) || segundos <= 0) return NaN;
    // Si el usuario piensa en minutos por kilómetro, se lleva a /100m, que es
    // la unidad con la que trabaja la fórmula.
    return modo === 'km' ? segundos / 10 : segundos;
  }, [ritmoTexto, modo]);

  const fueraDeRango =
    Number.isFinite(ritmoPor100m) &&
    (ritmoPor100m < RITMO_MIN || ritmoPor100m > RITMO_MAX);

  const tabla = useMemo(
    () => (fueraDeRango ? [] : tablaDePacing(ritmoPor100m)),
    [ritmoPor100m, fueraDeRango],
  );

  const textoParaCopiar = useMemo(
    () =>
      tabla.length === 0
        ? ''
        : tabla.map(f => `${f.metros}m: ${f.tiempo}`).join('\n'),
    [tabla],
  );

  return (
    <div className="run-pacing-card">
      <h2>PACING DE CARRERA</h2>

      <div className="input-group">
        <label htmlFor="pacing-modo">Ingresar el ritmo por</label>
        <select
          id="pacing-modo"
          value={modo}
          onChange={e => cambiarModo(e.target.value)}
        >
          <option value="100m">100 metros</option>
          <option value="km">Kilómetro</option>
        </select>
      </div>

      <div className="input-group">
        <label htmlFor="pacing-ritmo">
          {modo === 'km' ? 'Ritmo por km (mm:ss)' : 'Ritmo por 100m (segundos)'}
        </label>
        <input
          id="pacing-ritmo"
          type="text"
          inputMode="numeric"
          value={ritmoTexto}
          onChange={e => setRitmoTexto(e.target.value)}
          placeholder={modo === 'km' ? '5:00' : '30'}
        />

        {Number.isFinite(ritmoPor100m) && !fueraDeRango && (
          <p className="pacing-equivalencia">
            Equivale a <strong>{formatearTiempo(ritmoPor100m)}</strong> cada
            100m · <strong>{formatearTiempo(ritmoPorKm(ritmoPor100m))}</strong>{' '}
            cada km
          </p>
        )}

        {fueraDeRango && (
          <p className="pacing-equivalencia">
            Ese ritmo queda fuera del rango razonable (
            {formatearTiempo(RITMO_MIN)} a {formatearTiempo(RITMO_MAX)} cada
            100m).
          </p>
        )}
      </div>

      {tabla.length > 0 && (
        <>
          <table className="pacing-tabla">
            <caption>Tiempo estimado manteniendo ese ritmo</caption>
            <thead>
              <tr>
                <th scope="col">Distancia</th>
                <th scope="col" style={{ textAlign: 'end' }}>
                  Tiempo
                </th>
              </tr>
            </thead>
            <tbody>
              {tabla.map(({ metros, tiempo }) => (
                <tr key={metros}>
                  <th scope="row">
                    {metros >= 1000
                      ? `${(metros / 1000).toFixed(metros % 1000 === 0 ? 0 : 1)} km`
                      : `${metros} m`}
                  </th>
                  <td>{tiempo}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            type="button"
            className="btn-copiar"
            data-copiado={copiado}
            onClick={() => copiar(textoParaCopiar)}
          >
            {copiado ? <FaCheck /> : <FaRegCopy />}
            {copiado ? 'Copiado' : 'Copiar tabla'}
          </button>
        </>
      )}
    </div>
  );
};

export default RunPacingCard;
