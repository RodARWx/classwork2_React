/* Reusable action buttons for submitting and resetting the form */
export default function ActionButtons({ onClear, isClearDisabled }) {
  return (
    <div className="button-group">
      <button type="submit" className="btn btn-primary">
        Result
      </button>
      <button
        type="button"
        onClick={onClear}
        disabled={isClearDisabled}
        className="btn btn-secondary"
      >
        Clear
      </button>
    </div>
  );
}
