import { useState } from 'react';
import './WeightPercentageCalculator.css'; // Archivo CSS para los estilos

const WeightPercentageCalculator = () => {
  const [weight, setWeight] = useState('');
  const [percentage, setPercentage] = useState('');
  const [result, setResult] = useState('');

  const handleWeightChange = (e) => {
    setWeight(e.target.value);
    calculateResult(e.target.value, percentage);
  };

  const handlePercentageChange = (e) => {
    setPercentage(e.target.value);
    calculateResult(weight, e.target.value);
  };

  const calculateResult = (weight, percentage) => {
    if (!isNaN(weight) && !isNaN(percentage)) {
      const calculatedResult = (weight * percentage) / 100;
      setResult(calculatedResult.toFixed(1)); // Redondeamos a dos decimales
    } else {
      setResult('');
    }
  };

  return (
    <div className="card-3">
      <h2>Weight Percentage Calculator</h2>
      <div className="input-group">
        <label htmlFor="weightInput">Weight (kg or lb):</label>
        <input
          type="text"
          id="weightInput"
          value={weight}
          onChange={handleWeightChange}
          placeholder="Enter weight"
        />
      </div>
      <div className="input-group">
        <label htmlFor="percentageInput">Percentage (%):</label>
        <input
          type="text"
          id="percentageInput"
          value={percentage}
          onChange={handlePercentageChange}
          placeholder="Enter percentage"
        />
      </div>
      {result && (
        <div className="result">
          <h3>Result:</h3>
          <p>{result} kg</p>
        </div>
      )}
    </div>
  );
};

export default WeightPercentageCalculator;
