import { useState } from 'react';
import { convertWeight } from '../logic_conversion/conversionWeight';
import '../styles/ConversorWeightCard.css'; // Importa el archivo CSS

const ConversorWeightCard = () => {
  const [inputValue, setInputValue] = useState('');
  const [outputValue, setOutputValue] = useState('');
  const [conversionType, setConversionType] = useState('lbsToKg');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (e.target.value === '') {
      setOutputValue('');
    } else {
      convertAndSetOutput(e.target.value, conversionType);
    }
  };

  const handleConversionChange = (e) => {
    const newConversionType = e.target.value;
    setConversionType(newConversionType);
    convertAndSetOutput(inputValue, newConversionType);
  };

  const convertAndSetOutput = (value, type) => {
    if (!isNaN(value)) {
      const result = type === 'lbsToKg' ? convertWeight('lbsToKg', value) : convertWeight('kgToLbs', value);
      setOutputValue(result);
    }
  };

  return (
    <div className="conversor-weight-card">
      <h2>CONVERTIDOR DE PESO</h2>
      <div className="conversion-options">
        <label>
          <input
            type="radio"
            value="lbsToKg"
            checked={conversionType === 'lbsToKg'}
            onChange={handleConversionChange}
          />
          libras a kilos
        </label>
        <label>
          <input
            type="radio"
            value="kgToLbs"
            checked={conversionType === 'kgToLbs'}
            onChange={handleConversionChange}
          />
          kilos a libras
        </label>
      </div>
      <div className="input-section">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Ingrese el peso"
        />  
      </div>
      <div className="result-section">
          <span className="result-label">Resultado:</span>
          <span className="result">{outputValue}</span>
        </div>
    </div>
  );
};

export default ConversorWeightCard;
