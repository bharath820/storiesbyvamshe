import { useEffect, useState } from "react";
import { defaultCategories } from "../../data/defaultCategories";
import {
  createDocument,
  removeDocument,
  subscribeCollection,
  updateDocument
} from "../../lib/firestoreService";
import { slugify } from "../../utils/slugify";

export function AdminCategoriesPage() {
  const [rows, setRows] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("both");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    return subscribeCollection("categories", setRows, (error) => setActionError(error.message));
  }, []);

  async function addCategory(event) {
    event.preventDefault();
    try {
      await createDocument("categories", {
        name: name.trim() || "Untitled Category",
        slug: slugify(name),
        type,
        isActive: true
      });
      setName("");
      setType("both");
      setActionError("");
    } catch (error) {
      setActionError(error.message || "Could not save category.");
    }
  }

  async function seedDefaults() {
    const existing = new Set(rows.map((item) => item.slug));
    try {
      const jobs = defaultCategories
        .filter((item) => !existing.has(item.slug))
        .map((item) => createDocument("categories", item));
      await Promise.all(jobs);
      setActionError("");
    } catch (error) {
      setActionError(error.message || "Could not seed categories.");
    }
  }

  return (
    <div>
      <h1>Categories</h1>
      <form onSubmit={addCategory} className="admin-form-grid">
        <input
          className="input"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select className="select" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="both">Both</option>
          <option value="photo">Photo</option>
          <option value="video">Video</option>
        </select>
        <button className="btn btn-primary" type="submit">
          Add
        </button>
        <button className="btn btn-soft" type="button" onClick={seedDefaults}>
          Seed Core 8
        </button>
      </form>
      {actionError && <p className="error-text">{actionError}</p>}

      <div className="admin-list">
        {rows.map((row) => (
          <article key={row.id} className="admin-list-item">
            <div>
              <strong>{row.name}</strong>
              <p>
                {row.slug} - {row.type}
              </p>
            </div>
            <div className="admin-actions">
              <button
                className="btn btn-soft"
                type="button"
                onClick={() =>
                  updateDocument("categories", row.id, { isActive: !row.isActive })
                    .catch((error) => setActionError(error.message || "Could not update category."))
                }
              >
                {row.isActive ? "Disable" : "Enable"}
              </button>
              <button
                className="btn btn-soft"
                type="button"
                onClick={() =>
                  removeDocument("categories", row.id)
                    .catch((error) => setActionError(error.message || "Could not delete category."))
                }
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

