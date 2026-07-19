import { useEffect, useRef } from "react";

export function CategoryTabs({ categories, active, onChange, allowAll = true }) {
  const activeButtonRef = useRef(null);

  useEffect(() => {
    activeButtonRef.current?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [active]);

  return (
    <div className="category-tabs">
      {allowAll && (
        <button
          type="button"
          ref={active === "all" ? activeButtonRef : null}
          className={active === "all" ? "is-active" : ""}
          aria-pressed={active === "all"}
          onClick={() => onChange("all")}
        >
          All
        </button>
      )}
      {categories.map((category) => (
        <button
          type="button"
          key={category.id}
          ref={active === category.id ? activeButtonRef : null}
          className={active === category.id ? "is-active" : ""}
          aria-pressed={active === category.id}
          onClick={() => onChange(category.id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}

