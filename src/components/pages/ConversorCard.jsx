// src/components/ConversorCard.jsx
import  { useState } from 'react';
import { convertCalories, convertMeters } from '../logic_conversion/conversion';
import '../styles/ConversorCard.css';

const ConversorCard = () => {
  const [inputValue, setInputValue] = useState('');
  const [gender, setGender] = useState('male');
  const [inputActivity, setInputActivity] = useState('rowerSkiCal');
  const [outputActivity, setOutputActivity] = useState('bikeErgCal');
  const [result, setResult] = useState(null);

  const handleConvert = () => {
    let convertedValue;
    if (inputActivity.includes('Cal')) {
      convertedValue = convertCalories(inputActivity, parseFloat(inputValue), gender, outputActivity);
    } else {
      convertedValue = convertMeters(inputActivity, parseFloat(inputValue), gender, outputActivity);
    }
    setResult(convertedValue);
  };

  return (
    <div className="conversor-card">
      <h2>CONVERSOR DE CALORÍAS Y METROS</h2>

      <div className="input-group">
        <label>Género:</label>
        <select value={gender} onChange={e => setGender(e.target.value)}>
          <option value="male">Hombre</option>
          <option value="female">Mujer</option>
        </select>
      </div>

      <div className="input-group">
        <label>Actividad de Entrada:</label>
        <select value={inputActivity} onChange={e => setInputActivity(e.target.value)}>
          <option value="rowerSkiCal">Rower/Ski Erg (Cals)</option>
          <option value="bikeErgCal">Bike Erg (Cals)</option>
          <option value="assaultBikeCal">Assault Bike/Echo Bike (Cals)</option>
          <option value="runMeters">Run (Meters)</option>
          <option value="rowerSkiMeters">Rower/Ski (Meters)</option>
          <option value="bikeErgMeters">Bike Erg (Meters)</option>
        </select>
      </div>

      <div className="input-group">
        <label>Valor de Entrada:</label>
        <input
          type="number"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Ingrese el valor"
        />
      </div>

      <div className="input-group">
        <label>Convertir a:</label>
        <select value={outputActivity} onChange={e => setOutputActivity(e.target.value)}>
          <option value="rowerSkiCal">Rower/Ski Erg (Cals)</option>
          <option value="bikeErgCal">Bike Erg (Cals)</option>
          <option value="assaultBikeCal">Assault Bike/Echo Bike (Cals)</option>
          <option value="runMeters">Run (Meters)</option>
          <option value="rowerSkiMeters">Rower/Ski (Meters)</option>
          <option value="bikeErgMeters">Bike Erg (Meters)</option>
        </select>
      </div>

      <button className='converter_btn' onClick={handleConvert}>Convertir</button>

      {result !== null && (
        <div className="result">
          <h3>Resultado:</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

export default ConversorCard;
