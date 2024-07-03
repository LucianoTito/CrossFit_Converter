// src/App.jsx
import './App.css';
import ConversorCard from './components/ConversorCard';
import ConversorWeightCard from './components/ConversorWeightCard';
import WeightPercentageCalculator from './components/WeightPercentageCalculator'; // Importamos el nuevo componente
import { FaLinkedin } from 'react-icons/fa'; // Importamos el ícono de LinkedIn

function App() {
  return (
    <>
      <div className='App'>
        <div className="card">
          <WeightPercentageCalculator />
        </div>
        <div className="card">
          <ConversorWeightCard />
        </div>
        <div className="card">
          <ConversorCard />
        </div>
        <footer>
          Creado por Luciano Tito 
          <a href="https://www.linkedin.com/in/luciano-facundo-tito-cedr%C3%B3n/" target="_blank" rel="noopener noreferrer" >

          <div className='linkedin_ico_conteiner'>
          <FaLinkedin className="icon" />
          </div>
          </a>
        </footer>
      </div>
    </>
  );
}

export default App;

