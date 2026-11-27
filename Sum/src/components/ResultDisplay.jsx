/* Presentational component that conditionally renders the result or error */
export default function ResultDisplay({ result, error }) {
  if (error) {
    return (
      <div className="result-box result-error" role="alert">
        {error}
      </div>
    );
  }

  if (result === null) {
    return null;
  }

  return (
    <div className="result-box result-success" aria-live="polite">
      <span className="result-label">Result</span>
      <span className="result-value">{result}</span>
    </div>
  );
}
