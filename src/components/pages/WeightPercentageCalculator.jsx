// src/components/pages/WeightPercentageCalculator.jsx
import { useMemo, useState } from 'react';
import { FaCheck, FaRegCopy } from 'react-icons/fa6';
import { useCopiar } from '../../hooks/usePreferencia';
import '../styles/WeightPercentageCalculator.css';

// Los porcentajes que más aparecen al escalar cargas sobre un 1RM.
const FRECUENTES = [50, 60, 65, 70, 75, 80, 85, 90, 95];

const WeightPercentageCalculator = () => {
  const [weight, setWeight] = useState('');
  const [percentage, setPercentage] = useState('');
  const [copiado, copiar] = useCopiar();

  const resultado = useMemo(() => {
    const peso = parseFloat(weight);
    const pct = parseFloat(percentage);
    if (!Number.isFinite(peso) || !Number.isFinite(pct)) return null;
    return ((peso * pct) / 100).toFixed(1).replace(/\.0$/, '');
  }, [weight, percentage]);

  return (
    <div className="weight-percentage-card">
      <h2>CALCULADORA DE PORCENTAJE</h2>

      <div className="input-group">
        <label htmlFor="pct-peso">Peso de referencia (kg o lb)</label>
        <input
          id="pct-peso"
          type="number"
          inputMode="decimal"
          min="0"
          value={weight}
          onChange={e => setWeight(e.target.value)}
          placeholder="Por ejemplo, su 1RM"
        />
      </div>

      <div className="input-group">
        <label htmlFor="pct-valor">Porcentaje (%)</label>
        <input
          id="pct-valor"
          type="number"
          inputMode="decimal"
          min="0"
          value={percentage}
          onChange={e => setPercentage(e.target.value)}
          placeholder="Ingrese el porcentaje"
        />

        <div className="porcentajes-rapidos">
          {FRECUENTES.map(p => (
            <button
              key={p}
              type="button"
              className="porcentajes-rapidos__btn"
              aria-pressed={String(p) === percentage}
              onClick={() => setPercentage(String(p))}
            >
              {p}%
            </button>
          ))}
        </div>
      </div>

      {resultado !== null && (
        <div className="result-box" aria-live="polite">
          <span className="result-box__label">Resultado</span>
          <span className="result-box__value">{resultado}</span>
          <button
            type="button"
            className="btn-copiar"
            data-copiado={copiado}
            onClick={() => copiar(resultado)}
          >
            {copiado ? <FaCheck /> : <FaRegCopy />}
            {copiado ? 'Copiado' : 'Copiar'}
          </button>
        </div>
      )}
    </div>
  );
};

export default WeightPercentageCalculator;
