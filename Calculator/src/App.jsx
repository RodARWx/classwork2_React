import { useState } from 'react';
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import SamsungCalculator from './calculator/SamsungCalculator';

export function App({ onBack }) {
  const [theme, setTheme] = useState('dark');
  const isDark = theme === 'dark';

  const handleBack = () => {
    if (onBack) onBack();
    else window.history.back();
  };

  return (
    <main
      className={`min-h-screen flex flex-col items-center justify-center p-4 gap-4 transition-colors duration-200 ${
        isDark ? 'bg-neutral-950 text-neutral-100' : 'bg-neutral-200 text-neutral-900'
      }`}
    >
      <div className="w-[320px] flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleBack}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition cursor-pointer ${
            isDark
              ? 'bg-neutral-900 border-neutral-700 text-neutral-200 hover:bg-neutral-800'
              : 'bg-white border-neutral-300 text-neutral-800 hover:bg-neutral-50'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Volver
        </button>

        <button
          type="button"
          onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition cursor-pointer ${
            isDark
              ? 'bg-neutral-900 border-neutral-700 text-neutral-200 hover:bg-neutral-800'
              : 'bg-white border-neutral-300 text-neutral-800 hover:bg-neutral-50'
          }`}
        >
          {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          {isDark ? 'Modo Claro' : 'Modo Oscuro'}
        </button>
      </div>

      <SamsungCalculator theme={theme} />
    </main>
  );
}

export default App;
