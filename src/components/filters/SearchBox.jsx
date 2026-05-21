export function SearchBox({ value, onChange, placeholder = "Search..." }) {
  return (
    <label className="search-box">
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="input"
      />
    </label>
  );
}

