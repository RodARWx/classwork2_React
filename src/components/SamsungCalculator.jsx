import { useState, useEffect, useCallback } from 'react';
import { Clock, Ruler, Sigma, Delete } from 'lucide-react';
import {
  appendParenthesis,
  evaluateExpression,
  formatResult,
  isOperator,
  toggleSign,
} from '../utils/calculatorEngine';
import HistoryPanel from './HistoryPanel';
import UnitConverter from './UnitConverter';

function renderHighlightedExpression(expr, greenClass) {
  return expr.split(/([+\-×÷%()])/).map((part, i) =>
    /^[+\-×÷%()]$/.test(part) ? (
      <span key={i} className={greenClass}>
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function SamsungCalculator({ theme = 'dark' }) {
  const isDark = theme === 'dark';

  const [expression, setExpression] = useState('0');
  const [justEvaluated, setJustEvaluated] = useState(false);
  const [history, setHistory] = useState([]);
  const [activePanel, setActivePanel] = useState('keypad'); // 'keypad' | 'history' | 'converter'
  const [isScientific, setIsScientific] = useState(false);

  const hasOperator = /[+\-×÷%()]|sin|cos|tan|√|ln|log|\^/.test(expression.slice(1));
  const livePreview = hasOperator ? evaluateExpression(expression) : null;

  const handleDigit = useCallback(
    (digit) => {
      setExpression((prev) => {
        if (prev === 'Error' || justEvaluated) {
          setJustEvaluated(false);
          return digit;
        }
        return prev === '0' ? digit : prev + digit;
      });
    },
    [justEvaluated]
  );

  const handleOperator = useCallback((op) => {
    setJustEvaluated(false);
    setExpression((prev) => {
      if (prev === 'Error') return '0' + op;
      const last = prev.slice(-1);
      if (isOperator(last)) {
        return prev.slice(0, -1) + op;
      }
      return prev + op;
    });
  }, []);

  const handleClear = useCallback(() => {
    setExpression('0');
    setJustEvaluated(false);
  }, []);

  const handleDelete = useCallback(() => {
    setJustEvaluated(false);
    setExpression((prev) => {
      if (prev === 'Error' || prev.length <= 1) return '0';
      return prev.slice(0, -1);
    });
  }, []);

  const handleDecimal = useCallback(() => {
    setJustEvaluated(false);
    setExpression((prev) => {
      if (prev === 'Error') return '0.';
      const parts = prev.split(/[+\-×÷()]/);
      const currentNum = parts[parts.length - 1];
      if (currentNum.includes('.')) return prev;
      return isOperator(prev.slice(-1)) || prev.slice(-1) === '(' ? prev + '0.' : prev + '.';
    });
  }, []);

  const handlePercent = useCallback(() => {
    setJustEvaluated(false);
    setExpression((prev) => {
      if (prev === 'Error' || isOperator(prev.slice(-1))) return prev;
      return prev + '%';
    });
  }, []);

  const handleParen = useCallback(() => {
    setJustEvaluated(false);
    setExpression((prev) => appendParenthesis(prev));
  }, []);

  const handleSign = useCallback(() => {
    setJustEvaluated(false);
    setExpression((prev) => toggleSign(prev));
  }, []);

  const handleEquals = useCallback(() => {
    const result = evaluateExpression(expression);
    if (result === null) return;
    if (result === 'Error') {
      setExpression('Error');
      setJustEvaluated(true);
      return;
    }

    const formatted = formatResult(result);
    setHistory((prev) => [
      { expression, result: String(result), formattedResult: formatted },
      ...prev.slice(0, 29),
    ]);
    setExpression(String(result));
    setJustEvaluated(true);
  }, [expression]);

  const handleScientific = (token) => {
    setJustEvaluated(false);
    setExpression((prev) => {
      const base = prev === '0' || prev === 'Error' ? '' : prev;
      if (token === 'x²') return prev === 'Error' ? '0' : `${prev}^2`;
      if (token === 'π' || token === 'e') {
        return base === '' || isOperator(base.slice(-1)) || base.slice(-1) === '('
          ? base + token
          : `${base}×${token}`;
      }
      return base === '' || isOperator(base.slice(-1)) || base.slice(-1) === '('
        ? `${base}${token}`
        : `${base}×${token}`;
    });
  };

  // Physical keyboard support
  useEffect(() => {
    const onKeyDown = (e) => {
      if (activePanel !== 'keypad') return;
      if (/^[0-9]$/.test(e.key)) handleDigit(e.key);
      else if (e.key === '+') handleOperator('+');
      else if (e.key === '-') handleOperator('-');
      else if (e.key === '*') handleOperator('×');
      else if (e.key === '/') {
        e.preventDefault();
        handleOperator('÷');
      } else if (e.key === '.') handleDecimal();
      else if (e.key === '%') handlePercent();
      else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Backspace') handleDelete();
      else if (e.key === 'Escape') handleClear();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    activePanel,
    handleDigit,
    handleOperator,
    handleDecimal,
    handlePercent,
    handleEquals,
    handleDelete,
    handleClear,
  ]);

  const greenText = isDark ? 'text-[#7cc96e]' : 'text-[#489b37]';
  const btnSurface = isDark
    ? 'bg-[#1b1b1b] text-white hover:bg-[#262626]'
    : 'bg-white text-neutral-800 shadow-sm hover:bg-neutral-100';

  const displayFormatted =
    justEvaluated && expression !== 'Error' && !/[+\-×÷%()]/.test(expression.slice(1))
      ? formatResult(expression)
      : expression;

  return (
    <div
      className={`w-[320px] rounded-[38px] border-[3px] p-4 shadow-2xl select-none transition-colors duration-200 ${
        isDark
          ? 'bg-[#010101] border-[#2b2b2b] text-white'
          : 'bg-[#f6f6f6] border-neutral-300 text-neutral-900'
      }`}
    >
      {activePanel === 'converter' ? (
        <UnitConverter isDark={isDark} onBack={() => setActivePanel('keypad')} />
      ) : (
        <>
          {/* Dual Display */}
          <div className="px-2 pt-4 pb-2 min-h-[112px] flex flex-col justify-end text-right">
            <div
              className={`font-light tracking-tight break-all leading-snug transition-all ${
                displayFormatted.length > 12 ? 'text-2xl' : 'text-4xl'
              }`}
            >
              {renderHighlightedExpression(displayFormatted, greenText)}
            </div>
            <div
              className={`h-7 mt-1 text-lg font-light tabular-nums ${
                isDark ? 'text-neutral-500' : 'text-neutral-400'
              }`}
            >
              {livePreview !== null ? formatResult(livePreview) : ''}
            </div>
          </div>

          {/* Samsung Utility Toolbar */}
          <div
            className={`flex items-center justify-between px-3 py-2.5 border-b ${
              isDark ? 'border-neutral-800' : 'border-neutral-200'
            }`}
          >
            <div className="flex items-center gap-5">
              <button
                type="button"
                onClick={() =>
                  setActivePanel((p) => (p === 'history' ? 'keypad' : 'history'))
                }
                title="Historial"
                className={`transition cursor-pointer ${
                  activePanel === 'history' ? greenText : 'opacity-65 hover:opacity-100'
                }`}
              >
                <Clock className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setActivePanel('converter')}
                title="Conversor de unidades"
                className="opacity-65 hover:opacity-100 transition cursor-pointer"
              >
                <Ruler className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setActivePanel('keypad');
                  setIsScientific((s) => !s);
                }}
                title="Modo científico"
                className={`transition cursor-pointer ${
                  isScientific ? greenText : 'opacity-65 hover:opacity-100'
                }`}
              >
                <Sigma className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleDelete}
              title="Borrar (DEL)"
              className={`${greenText} hover:opacity-80 active:scale-90 transition cursor-pointer`}
            >
              <Delete className="w-5 h-5" />
            </button>
          </div>

          {activePanel === 'history' ? (
            <HistoryPanel
              history={history}
              isDark={isDark}
              onSelect={(val) => {
                setExpression(val);
                setJustEvaluated(false);
                setActivePanel('keypad');
              }}
              onClear={() => setHistory([])}
            />
          ) : (
            <div className="pt-3 space-y-2.5">
              {/* Optional Scientific Strip */}
              {isScientific && (
                <div className="grid grid-cols-5 gap-1.5 pb-1">
                  {[
                    { label: '√', token: '√(' },
                    { label: 'x²', token: 'x²' },
                    { label: 'sin', token: 'sin(' },
                    { label: 'cos', token: 'cos(' },
                    { label: 'tan', token: 'tan(' },
                    { label: 'ln', token: 'ln(' },
                    { label: 'log', token: 'log(' },
                    { label: 'π', token: 'π' },
                    { label: 'e', token: 'e' },
                    { label: '^', token: '^' },
                  ].map((sci) => (
                    <button
                      key={sci.label}
                      type="button"
                      onClick={() => handleScientific(sci.token)}
                      className={`h-8 rounded-full text-xs font-medium active:scale-95 transition cursor-pointer ${btnSurface} ${greenText}`}
                    >
                      {sci.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Standard Samsung 4x5 Circular Keypad */}
              <div className="grid grid-cols-4 gap-2.5">
                <button
                  type="button"
                  onClick={handleClear}
                  className={`h-14 w-14 mx-auto rounded-full text-xl font-normal active:scale-95 transition cursor-pointer ${btnSurface} text-[#e06c65]`}
                >
                  C
                </button>
                <button
                  type="button"
                  onClick={handleParen}
                  className={`h-14 w-14 mx-auto rounded-full text-lg font-normal active:scale-95 transition cursor-pointer ${btnSurface} ${greenText}`}
                >
                  ( )
                </button>
                <button
                  type="button"
                  onClick={handlePercent}
                  className={`h-14 w-14 mx-auto rounded-full text-xl font-normal active:scale-95 transition cursor-pointer ${btnSurface} ${greenText}`}
                >
                  %
                </button>
                <button
                  type="button"
                  onClick={() => handleOperator('÷')}
                  className={`h-14 w-14 mx-auto rounded-full text-2xl font-normal active:scale-95 transition cursor-pointer ${btnSurface} ${greenText}`}
                >
                  ÷
                </button>

                {['7', '8', '9'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => handleDigit(d)}
                    className={`h-14 w-14 mx-auto rounded-full text-2xl font-light active:scale-95 transition cursor-pointer ${btnSurface}`}
                  >
                    {d}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handleOperator('×')}
                  className={`h-14 w-14 mx-auto rounded-full text-2xl font-normal active:scale-95 transition cursor-pointer ${btnSurface} ${greenText}`}
                >
                  ×
                </button>

                {['4', '5', '6'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => handleDigit(d)}
                    className={`h-14 w-14 mx-auto rounded-full text-2xl font-light active:scale-95 transition cursor-pointer ${btnSurface}`}
                  >
                    {d}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handleOperator('-')}
                  className={`h-14 w-14 mx-auto rounded-full text-2xl font-normal active:scale-95 transition cursor-pointer ${btnSurface} ${greenText}`}
                >
                  −
                </button>

                {['1', '2', '3'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => handleDigit(d)}
                    className={`h-14 w-14 mx-auto rounded-full text-2xl font-light active:scale-95 transition cursor-pointer ${btnSurface}`}
                  >
                    {d}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handleOperator('+')}
                  className={`h-14 w-14 mx-auto rounded-full text-2xl font-normal active:scale-95 transition cursor-pointer ${btnSurface} ${greenText}`}
                >
                  +
                </button>

                <button
                  type="button"
                  onClick={handleSign}
                  className={`h-14 w-14 mx-auto rounded-full text-base font-normal active:scale-95 transition cursor-pointer ${btnSurface}`}
                >
                  +/-
                </button>
                <button
                  type="button"
                  onClick={() => handleDigit('0')}
                  className={`h-14 w-14 mx-auto rounded-full text-2xl font-light active:scale-95 transition cursor-pointer ${btnSurface}`}
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={handleDecimal}
                  className={`h-14 w-14 mx-auto rounded-full text-2xl font-light active:scale-95 transition cursor-pointer ${btnSurface}`}
                >
                  .
                </button>
                <button
                  type="button"
                  onClick={handleEquals}
                  className="h-14 w-14 mx-auto rounded-full bg-[#3b872a] text-white text-2xl font-normal hover:brightness-110 active:scale-95 transition cursor-pointer shadow-md"
                >
                  =
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Samsung Bottom Gesture Indicator */}
      <div className="mt-4 flex justify-center">
        <div
          className={`w-24 h-1 rounded-full ${
            isDark ? 'bg-neutral-700' : 'bg-neutral-300'
          }`}
        />
      </div>
    </div>
  );
}
