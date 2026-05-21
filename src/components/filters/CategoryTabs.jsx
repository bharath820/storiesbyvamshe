export function CategoryTabs({ categories, active, onChange, allowAll = true }) {
  return (
    <div className="category-tabs">
      {allowAll && (
        <button
          type="button"
          className={active === "all" ? "is-active" : ""}
          onClick={() => onChange("all")}
        >
          All
        </button>
      )}
      {categories.map((category) => (
        <button
          type="button"
          key={category.id}
          className={active === category.id ? "is-active" : ""}
          onClick={() => onChange(category.id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}

