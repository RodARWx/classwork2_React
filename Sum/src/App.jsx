import { useState } from 'react';
import NumberInput from './components/NumberInput.jsx';
import ActionButtons from './components/ActionButtons.jsx';
import ResultDisplay from './components/ResultDisplay.jsx';

/* Pure helper function to keep calculation logic decoupled from UI */
function calculateSum(a, b) {
  return a + b;
}

export default function App() {
  // Lifted state: App is the single source of truth for inputs and output
  const [numberA, setNumberA] = useState('');
  const [numberB, setNumberB] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleNumberAChange = (value) => {
    setNumberA(value);
    setResult(null);
    setError('');
  };

  const handleNumberBChange = (value) => {
    setNumberB(value);
    setResult(null);
    setError('');
  };

  const handleCalculate = (event) => {
    event.preventDefault();

    if (numberA.trim() === '' || numberB.trim() === '') {
      setResult(null);
      setError('Please enter both Number A and Number B.');
      return;
    }

    const parsedA = Number(numberA);
    const parsedB = Number(numberB);

    if (Number.isNaN(parsedA) || Number.isNaN(parsedB)) {
      setResult(null);
      setError('Please enter valid numeric values.');
      return;
    }

    setError('');
    setResult(calculateSum(parsedA, parsedB));
  };

  const handleClear = () => {
    setNumberA('');
    setNumberB('');
    setResult(null);
    setError('');
  };

  const isClearDisabled =
    numberA === '' && numberB === '' && result === null && error === '';

  return (
    <main className="page">
      <section className="card" aria-labelledby="sum-title">
        <header className="card-header">
          <h1 id="sum-title" className="title">
            Sum Calculator
          </h1>
          <p className="subtitle">Enter two numbers to compute their sum.</p>
        </header>

        <form className="sum-form" onSubmit={handleCalculate} noValidate>
          <div className="inputs-grid">
            <NumberInput
              id="number-a"
              label="Number A"
              value={numberA}
              onChange={handleNumberAChange}
              placeholder="0"
            />
            <NumberInput
              id="number-b"
              label="Number B"
              value={numberB}
              onChange={handleNumberBChange}
              placeholder="0"
            />
          </div>

          <ActionButtons
            onClear={handleClear}
            isClearDisabled={isClearDisabled}
          />
        </form>

        <ResultDisplay result={result} error={error} />
      </section>
    </main>
  );
}
