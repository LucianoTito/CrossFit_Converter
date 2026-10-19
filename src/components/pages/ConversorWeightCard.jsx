// src/components/pages/ConversorWeightCard.jsx
import { useMemo, useState } from 'react';
import { FaCheck, FaRegCopy } from 'react-icons/fa6';
import { convertWeight } from '../logic_conversion/conversionWeight';
import { usePreferencia, useCopiar } from '../../hooks/usePreferencia';
import '../styles/ConversorWeightCard.css';

const SENTIDOS = [
  { valor: 'lbsToKg', etiqueta: 'Libras → Kilos', simbolo: 'kg' },
  { valor: 'kgToLbs', etiqueta: 'Kilos → Libras', simbolo: 'lb' },
];

const ConversorWeightCard = () => {
  const [inputValue, setInputValue] = useState('');
  const [conversionType, setConversionType] = usePreferencia(
    'peso:sentido',
    'lbsToKg',
  );
  const [copiado, copiar] = useCopiar();

  const resultado = useMemo(() => {
    const valor = parseFloat(inputValue);
    if (!Number.isFinite(valor)) return '';
    return convertWeight(conversionType, valor);
  }, [inputValue, conversionType]);

  const simbolo =
    SENTIDOS.find(s => s.valor === conversionType)?.simbolo ?? '';
  const textoResultado = resultado === '' ? '' : `${resultado} ${simbolo}`;

  return (
    <div className="conversor-weight-card">
      <h2>CONVERSOR DE PESO</h2>

      <fieldset className="selector-sentido">
        <legend className="sr-only">Sentido de la conversión</legend>
        {SENTIDOS.map(({ valor, etiqueta }) => (
          <label key={valor} className="selector-sentido__opcion">
            <input
              type="radio"
              name="sentido-peso"
              value={valor}
              checked={conversionType === valor}
              onChange={e => setConversionType(e.target.value)}
            />
            {etiqueta}
          </label>
        ))}
      </fieldset>

      <div className="input-group">
        <label htmlFor="peso-valor">Peso a convertir</label>
        <input
          id="peso-valor"
          type="number"
          inputMode="decimal"
          min="0"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Ingrese el peso"
        />
      </div>

      {textoResultado && (
        <div className="result-box" aria-live="polite">
          <span className="result-box__label">Resultado</span>
          <span className="result-box__value">{textoResultado}</span>
          <button
            type="button"
            className="btn-copiar"
            data-copiado={copiado}
            onClick={() => copiar(textoResultado)}
          >
            {copiado ? <FaCheck /> : <FaRegCopy />}
            {copiado ? 'Copiado' : 'Copiar'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ConversorWeightCard;
