// src/components/pages/ConversorCalsCard.jsx
import { useMemo, useState } from 'react';
import { FaArrowRightArrowLeft, FaCheck, FaRegCopy } from 'react-icons/fa6';
import { convertCalories, convertMeters } from '../logic_conversion/conversion';
import { timeDomainFormateado } from '../logic_conversion/timeDomain';
import { usePreferencia, useCopiar } from '../../hooks/usePreferencia';
import '../styles/ConversorCalsCard.css';

// Una sola lista para los dos desplegables. Antes estaban escritas dos veces,
// en distinto orden, lo que hacía fácil que una quedara desactualizada al
// agregar una máquina nueva.
const ACTIVIDADES = [
  {
    grupo: 'Metros',
    opciones: [
      { valor: 'runMeters', etiqueta: 'Run (Meters)', unidad: 'm' },
      { valor: 'rowerSkiMeters', etiqueta: 'Rower/Ski Erg (Meters)', unidad: 'm' },
      { valor: 'bikeErgMeters', etiqueta: 'Bike Erg (Meters)', unidad: 'm' },
      { valor: 'assaultBikeMeters', etiqueta: 'Assault Bike (Meters)', unidad: 'm' },
      { valor: 'echoBikeMeters', etiqueta: 'Echo Bike (Meters)', unidad: 'm' },
    ],
  },
  {
    grupo: 'Calorías',
    opciones: [
      { valor: 'rowerSkiCal', etiqueta: 'Rower/Ski Erg (Cals)', unidad: 'cal' },
      { valor: 'bikeErgCal', etiqueta: 'Bike Erg (Cals)', unidad: 'cal' },
      { valor: 'assaultBikeCal', etiqueta: 'Assault Bike (Cals)', unidad: 'cal' },
      { valor: 'echoBikeCal', etiqueta: 'Echo Bike (Cals)', unidad: 'cal' },
    ],
  },
  {
    grupo: 'Otros',
    opciones: [{ valor: 'DU_Reps', etiqueta: 'D.U (Reps)', unidad: 'reps' }],
  },
];

const PLANAS = ACTIVIDADES.flatMap(g => g.opciones);
const buscar = valor => PLANAS.find(o => o.valor === valor);

const OpcionesActividad = () =>
  ACTIVIDADES.map(({ grupo, opciones }) => (
    <optgroup key={grupo} label={grupo}>
      {opciones.map(({ valor, etiqueta }) => (
        <option key={valor} value={valor}>
          {etiqueta}
        </option>
      ))}
    </optgroup>
  ));

const ConversorCard = () => {
  const [inputValue, setInputValue] = useState('');
  // La división se recuerda: un coach la elige una vez, no en cada apertura.
  const [gender, setGender] = usePreferencia('division', 'male');
  const [inputActivity, setInputActivity] = usePreferencia(
    'cals:origen',
    'runMeters',
  );
  const [outputActivity, setOutputActivity] = usePreferencia(
    'cals:destino',
    'bikeErgMeters',
  );
  const [copiado, copiar] = useCopiar();

  // Conversión en vivo: el resultado se recalcula al escribir, sin botón.
  const resultado = useMemo(() => {
    const valor = parseFloat(inputValue);
    if (!Number.isFinite(valor) || valor < 0) return null;

    const convertir = inputActivity.includes('Cal')
      ? convertCalories
      : convertMeters;
    const salida = convertir(inputActivity, valor, gender, outputActivity);

    return Number.isFinite(salida) ? salida : null;
  }, [inputValue, inputActivity, outputActivity, gender]);

  // El time domain solo tiene sentido referido a una distancia de carrera:
  // el chart lo define contra los metros corridos, no contra las máquinas.
  const timeDomain = useMemo(() => {
    const valor = parseFloat(inputValue);
    if (!Number.isFinite(valor) || valor <= 0) return '';

    const metrosCarrera =
      inputActivity === 'runMeters'
        ? valor
        : outputActivity === 'runMeters'
          ? resultado
          : null;

    return metrosCarrera ? timeDomainFormateado(metrosCarrera) : '';
  }, [inputValue, inputActivity, outputActivity, resultado]);

  const intercambiar = () => {
    setInputActivity(outputActivity);
    setOutputActivity(inputActivity);
  };

  const unidadSalida = buscar(outputActivity)?.unidad ?? '';

  return (
    <div className="conversor-card">
      <h2>CONVERSOR DE CALORÍAS Y METROS</h2>

      <div className="input-group">
        <label htmlFor="cals-division">División</label>
        <select
          id="cals-division"
          value={gender}
          onChange={e => setGender(e.target.value)}
        >
          <option value="male">Hombre</option>
          <option value="female">Mujer</option>
        </select>
      </div>

      <div className="input-group">
        <label htmlFor="cals-origen">Actividad de entrada</label>
        <select
          id="cals-origen"
          value={inputActivity}
          onChange={e => setInputActivity(e.target.value)}
        >
          <OpcionesActividad />
        </select>
      </div>

      <div className="input-group">
        <label htmlFor="cals-valor">Valor de entrada</label>
        <input
          id="cals-valor"
          type="number"
          inputMode="decimal"
          min="0"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Ingrese el valor"
        />
      </div>

      <div className="conversor-card__fila-intercambio">
        <button
          type="button"
          className="btn-intercambio"
          onClick={intercambiar}
          aria-label="Invertir actividad de entrada y de salida"
          title="Invertir"
        >
          <FaArrowRightArrowLeft />
        </button>
      </div>

      <div className="input-group">
        <label htmlFor="cals-destino">Convertir a</label>
        <select
          id="cals-destino"
          value={outputActivity}
          onChange={e => setOutputActivity(e.target.value)}
        >
          <OpcionesActividad />
        </select>
      </div>

      {resultado !== null && (
        <div className="result-box" aria-live="polite">
          <span className="result-box__label">Resultado</span>
          <span className="result-box__value">
            {resultado} {unidadSalida}
          </span>

          {timeDomain && (
            <span className="result-box__nota">
              Tiempo esperado: {timeDomain}
            </span>
          )}

          <button
            type="button"
            className="btn-copiar"
            data-copiado={copiado}
            onClick={() => copiar(`${resultado} ${unidadSalida}`.trim())}
          >
            {copiado ? <FaCheck /> : <FaRegCopy />}
            {copiado ? 'Copiado' : 'Copiar'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ConversorCard;
