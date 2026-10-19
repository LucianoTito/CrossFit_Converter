// src/components/pages/ConversorCalsCard.jsx
import { useState } from 'react';
import { convertCalories, convertMeters } from '../logic_conversion/conversion';
import '../styles/ConversorCalsCard.css';

// Una sola lista para los dos desplegables. Antes estaban escritas dos veces,
// en distinto orden, lo que hacía fácil que una quedara desactualizada al
// agregar una máquina nueva.
const ACTIVIDADES = [
  {
    grupo: 'Metros',
    opciones: [
      { valor: 'runMeters', etiqueta: 'Run (Meters)' },
      { valor: 'rowerSkiMeters', etiqueta: 'Rower/Ski Erg (Meters)' },
      { valor: 'bikeErgMeters', etiqueta: 'Bike Erg (Meters)' },
      { valor: 'assaultBikeMeters', etiqueta: 'Assault Bike (Meters)' },
      { valor: 'echoBikeMeters', etiqueta: 'Echo Bike (Meters)' },
    ],
  },
  {
    grupo: 'Calorías',
    opciones: [
      { valor: 'rowerSkiCal', etiqueta: 'Rower/Ski Erg (Cals)' },
      { valor: 'bikeErgCal', etiqueta: 'Bike Erg (Cals)' },
      { valor: 'assaultBikeCal', etiqueta: 'Assault Bike (Cals)' },
      { valor: 'echoBikeCal', etiqueta: 'Echo Bike (Cals)' },
    ],
  },
  {
    grupo: 'Otros',
    opciones: [{ valor: 'DU_Reps', etiqueta: 'D.U (Reps)' }],
  },
];

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
  const [gender, setGender] = useState('male');
  const [inputActivity, setInputActivity] = useState('runMeters');
  const [outputActivity, setOutputActivity] = useState('bikeErgMeters');
  const [result, setResult] = useState(null);

  const handleConvert = () => {
    const valor = parseFloat(inputValue);

    // Sin esta guarda, un campo vacío o un texto inválido producen NaN y lo
    // muestran en pantalla como si fuera un resultado.
    if (!Number.isFinite(valor) || valor < 0) {
      setResult(null);
      return;
    }

    const convertir = inputActivity.includes('Cal')
      ? convertCalories
      : convertMeters;

    setResult(convertir(inputActivity, valor, gender, outputActivity));
  };

  return (
    <div className="conversor-card">
      <h2>CONVERSOR DE CALORÍAS Y METROS</h2>

      <div className="input-group">
        <label>División</label>
        <select value={gender} onChange={e => setGender(e.target.value)}>
          <option value="male">Hombre</option>
          <option value="female">Mujer</option>
        </select>
      </div>

      <div className="input-group">
        <label>Actividad de Entrada:</label>
        <select
          value={inputActivity}
          onChange={e => setInputActivity(e.target.value)}
        >
          <OpcionesActividad />
        </select>
      </div>

      <div className="input-group">
        <label>Valor de Entrada:</label>
        <input
          className="input-value"
          type="number"
          min="0"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Ingrese el valor"
        />
      </div>

      <div className="input-group">
        <label>Convertir a:</label>
        <select
          value={outputActivity}
          onChange={e => setOutputActivity(e.target.value)}
        >
          <OpcionesActividad />
        </select>
      </div>

      <button className="converter_btn" onClick={handleConvert}>
        Convertir
      </button>

      {result !== null && (
        <div className="result-cals-container">
          <h3 className="result-cals-container-title">Resultado:</h3>
          <p className="cals-result-value">{result}</p>
        </div>
      )}
    </div>
  );
};

export default ConversorCard;
