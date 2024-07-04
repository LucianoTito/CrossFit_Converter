// src/App.jsx
import './App.css';
import ConversorCard from './components/pages/ConversorCalsCard';
import ConversorWeightCard from './components/pages/ConversorWeightCard';
import WeightPercentageCalculator from './components/pages/WeightPercentageCalculator'; 
import { FaLinkedin, FaArrowUp } from 'react-icons/fa'; // Importamos los íconos de LinkedIn y Flecha hacia arriba

function App() {
  // Función para desplazarse hacia el inicio
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

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
        <button onClick={scrollToTop} className='scroll-to-top'>
            <FaArrowUp />
          </button>
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
