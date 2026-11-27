/* Reusable controlled input component for numeric values */
export default function NumberInput({ id, label, value, onChange, placeholder }) {
  return (
    <div className="input-group">
      <label htmlFor={id} className="input-label">
        {label}
      </label>
      <input
        id={id}
        type="number"
        step="any"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="input-field"
      />
    </div>
  );
}
