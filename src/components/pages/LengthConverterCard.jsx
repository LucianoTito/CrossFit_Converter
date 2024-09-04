import { useState } from 'react';
import '../styles/LengthConverterCard.css'; // Archivo CSS para los estilos

const LengthConverterCard = () => {
  const [inputValue, setInputValue] = useState('');
  const [inputUnit, setInputUnit] = useState('inches');
  const [outputUnit, setOutputUnit] = useState('centimeters');
  const [result, setResult] = useState(null);

  const handleConvert = () => {
    let convertedValue;

    // Convertir primero todo a centímetros
    const conversionsToCentimeters = {
      inches: inputValue * 2.54,
      feet: inputValue * 30.48,
      centimeters: parseFloat(inputValue), // Ya está en centímetros
      meters: inputValue * 100,
    };

    // Convertir de centímetros a la unidad de salida deseada
    const conversionsFromCentimeters = {
      inches: conversionsToCentimeters[inputUnit] / 2.54,
      feet: conversionsToCentimeters[inputUnit] / 30.48,
      centimeters: conversionsToCentimeters[inputUnit], // Ya está en centímetros
      meters: conversionsToCentimeters[inputUnit] / 100,
    };

    convertedValue = conversionsFromCentimeters[outputUnit];
    setResult(convertedValue.toFixed(1));
  };

  return (
    <div className="length-converter-card">
      <h2>CONVERSOR DE LONGITUD</h2>

      <div className="input-group">
        <label>Unidad de Entrada:</label>
        <select value={inputUnit} onChange={e => setInputUnit(e.target.value)}>
          <option value="inches">Pulgadas (Inches)</option>
          <option value="feet">Pies (Feet)</option>
          <option value="centimeters">Centímetros</option>
          <option value="meters">Metros</option>
        </select>
      </div>

      <div className="input-group">
        <label>Valor de Entrada:</label>
        <input
          className='input-value'
          type="number"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Ingrese el valor"
        />
      </div>

      <div className="input-group">
        <label>Convertir a:</label>
        <select value={outputUnit} onChange={e => setOutputUnit(e.target.value)}>
          <option value="centimeters">Centímetros</option>
          <option value="meters">Metros</option>
          <option value="inches">Pulgadas (Inches) </option>
          <option value="feet">Pies (Feet)</option>
        </select>
      </div>

      <button className='converter_btn' onClick={handleConvert}>Convertir</button>

      {result !== null && (
        <div className="result-length-container">
          <h3 className='result-length-container-title'>Resultado:</h3>
          <p className='length-result-value'>{result}</p>
        </div>
      )}
    </div>
  );
};

export default LengthConverterCard;
