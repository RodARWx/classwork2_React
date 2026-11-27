import { useState } from 'react';
import { ChevronLeft, ArrowUpDown } from 'lucide-react';
import { CONVERTER_CATEGORIES, convertUnit } from './unitConverterData';

export default function UnitConverter({ isDark, onBack }) {
  const categoryKeys = Object.keys(CONVERTER_CATEGORIES);
  const [category, setCategory] = useState('Time');
  const [fromUnit, setFromUnit] = useState(CONVERTER_CATEGORIES.Time.defaultFrom);
  const [toUnit, setToUnit] = useState(CONVERTER_CATEGORIES.Time.defaultTo);
  const [inputValue, setInputValue] = useState('1');

  const handleCategoryChange = (catKey) => {
    setCategory(catKey);
    setFromUnit(CONVERTER_CATEGORIES[catKey].defaultFrom);
    setToUnit(CONVERTER_CATEGORIES[catKey].defaultTo);
  };

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const unitNames = Object.keys(CONVERTER_CATEGORIES[category].units);
  const converted = convertUnit(inputValue, category, fromUnit, toUnit);

  const surfaceBg = isDark ? 'bg-[#1b1b1b]' : 'bg-white shadow-sm';
  const textMuted = isDark ? 'text-neutral-400' : 'text-neutral-500';

  return (
    <div className="flex flex-col h-[370px] px-1 pt-1">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2">
        <button
          type="button"
          onClick={onBack}
          className="p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
          aria-label="Volver a la calculadora"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-sm font-medium">Unit converter</span>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-2.5 no-scrollbar">
        {categoryKeys.map((key) => {
          const active = key === category;
          return (
            <button
              key={key}
              type="button"
              onClick={() => handleCategoryChange(key)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                active
                  ? isDark
                    ? 'bg-[#2a2a2a] text-white'
                    : 'bg-neutral-800 text-white'
                  : `${textMuted} hover:opacity-80`
              }`}
            >
              {CONVERTER_CATEGORIES[key].label}
            </button>
          );
        })}
      </div>

      {/* From box */}
      <div className={`rounded-2xl p-3.5 ${surfaceBg}`}>
        <div className="flex items-center justify-between mb-2">
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className={`text-xs font-medium bg-transparent outline-none cursor-pointer ${
              isDark ? 'text-neutral-200' : 'text-neutral-800'
            }`}
          >
            {unitNames.map((u) => (
              <option key={u} value={u} className={isDark ? 'bg-[#1b1b1b]' : 'bg-white'}>
                {u}
              </option>
            ))}
          </select>
        </div>
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full bg-transparent text-right text-2xl font-light outline-none tabular-nums"
          placeholder="0"
        />
      </div>

      {/* Swap button */}
      <div className="flex justify-center -my-2 z-10">
        <button
          type="button"
          onClick={handleSwap}
          className="w-8 h-8 rounded-full bg-[#3b872a] text-white flex items-center justify-center shadow hover:brightness-110 active:scale-95 transition cursor-pointer"
          title="Intercambiar unidades"
        >
          <ArrowUpDown className="w-4 h-4" />
        </button>
      </div>

      {/* To box */}
      <div className={`rounded-2xl p-3.5 ${surfaceBg}`}>
        <div className="flex items-center justify-between mb-2">
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className={`text-xs font-medium bg-transparent outline-none cursor-pointer ${
              isDark ? 'text-neutral-200' : 'text-neutral-800'
            }`}
          >
            {unitNames.map((u) => (
              <option key={u} value={u} className={isDark ? 'bg-[#1b1b1b]' : 'bg-white'}>
                {u}
              </option>
            ))}
          </select>
        </div>
        <div className="text-right text-2xl font-light text-[#68b85a] tabular-nums truncate">
          {converted}
        </div>
      </div>
    </div>
  );
}
