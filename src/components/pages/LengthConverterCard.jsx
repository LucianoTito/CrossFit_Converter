// src/components/pages/LengthConverterCard.jsx
import { useMemo, useState } from 'react';
import { FaArrowRightArrowLeft, FaCheck, FaRegCopy } from 'react-icons/fa6';
import { usePreferencia, useCopiar } from '../../hooks/usePreferencia';
import '../styles/LengthConverterCard.css';

// Todo se define contra el metro, que es la unidad base del SI. Agregar una
// unidad nueva es agregar una línea acá: no hay que tocar la lógica.
// Los factores de pulgada y pie son exactos por definición desde 1959.
const UNIDADES = [
  { valor: 'meters', etiqueta: 'Metros', simbolo: 'm', enMetros: 1 },
  { valor: 'kilometers', etiqueta: 'Kilómetros', simbolo: 'km', enMetros: 1000 },
  { valor: 'centimeters', etiqueta: 'Centímetros', simbolo: 'cm', enMetros: 0.01 },
  { valor: 'inches', etiqueta: 'Pulgadas', simbolo: 'in', enMetros: 0.0254 },
  { valor: 'feet', etiqueta: 'Pies', simbolo: 'ft', enMetros: 0.3048 },
  { valor: 'yards', etiqueta: 'Yardas', simbolo: 'yd', enMetros: 0.9144 },
  { valor: 'miles', etiqueta: 'Millas', simbolo: 'mi', enMetros: 1609.344 },
];

const buscar = valor => UNIDADES.find(u => u.valor === valor);

// Los decimales se ajustan a la magnitud: 0.25 millas necesita tres
// decimales para ser útil, 1609 metros no necesita ninguno.
const formatear = n => {
  if (!Number.isFinite(n)) return '';
  const abs = Math.abs(n);
  if (abs === 0) return '0';
  if (abs >= 100) return n.toFixed(1).replace(/\.0$/, '');
  if (abs >= 1) return n.toFixed(2).replace(/\.?0+$/, '');
  return n.toFixed(4).replace(/\.?0+$/, '');
};

const LengthConverterCard = () => {
  const [inputValue, setInputValue] = useState('');
  const [inputUnit, setInputUnit] = usePreferencia('long:origen', 'meters');
  const [outputUnit, setOutputUnit] = usePreferencia('long:destino', 'miles');
  const [copiado, copiar] = useCopiar();

  const resultado = useMemo(() => {
    const valor = parseFloat(inputValue);
    if (!Number.isFinite(valor)) return null;

    const origen = buscar(inputUnit);
    const destino = buscar(outputUnit);
    if (!origen || !destino) return null;

    return (valor * origen.enMetros) / destino.enMetros;
  }, [inputValue, inputUnit, outputUnit]);

  const intercambiar = () => {
    setInputUnit(outputUnit);
    setOutputUnit(inputUnit);
  };

  const textoResultado =
    resultado === null
      ? ''
      : `${formatear(resultado)} ${buscar(outputUnit)?.simbolo ?? ''}`.trim();

  return (
    <div className="length-converter-card">
      <h2>CONVERSOR DE LONGITUD</h2>

      <div className="input-group">
        <label htmlFor="long-origen">Unidad de entrada</label>
        <select
          id="long-origen"
          value={inputUnit}
          onChange={e => setInputUnit(e.target.value)}
        >
          {UNIDADES.map(({ valor, etiqueta, simbolo }) => (
            <option key={valor} value={valor}>
              {etiqueta} ({simbolo})
            </option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label htmlFor="long-valor">Valor de entrada</label>
        <input
          id="long-valor"
          type="number"
          inputMode="decimal"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Ingrese el valor"
        />
      </div>

      <div className="conversor-card__fila-intercambio">
        <button
          type="button"
          className="btn-intercambio"
          onClick={intercambiar}
          aria-label="Invertir unidad de entrada y de salida"
          title="Invertir"
        >
          <FaArrowRightArrowLeft />
        </button>
      </div>

      <div className="input-group">
        <label htmlFor="long-destino">Convertir a</label>
        <select
          id="long-destino"
          value={outputUnit}
          onChange={e => setOutputUnit(e.target.value)}
        >
          {UNIDADES.map(({ valor, etiqueta, simbolo }) => (
            <option key={valor} value={valor}>
              {etiqueta} ({simbolo})
            </option>
          ))}
        </select>
      </div>

      {resultado !== null && (
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

export default LengthConverterCard;
