// src/App.jsx
import './App.css';
import ConversorCard from './components/ConversorCard';
import ConversorWeightCard from './components/ConversorWeightCard';
import WeightPercentageCalculator from './components/WeightPercentageCalculator'; // Importamos el nuevo componente

function App() {
  return (
    <>
     <div className="card">
        <WeightPercentageCalculator />
      </div>
      <div className="card">
        <ConversorWeightCard />
      </div>
      <div className="card">
        <ConversorCard />
      </div>
   
     
    </>
  );
}

export default App;