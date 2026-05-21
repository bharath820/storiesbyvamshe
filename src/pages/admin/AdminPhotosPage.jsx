import { useEffect, useState } from "react";
import {
  createDocument,
  listCollection,
  removeDocument,
  updateDocument
} from "../../lib/firestoreService";
import { ResolvedImage } from "../../components/media/ResolvedImage";
import { uploadAsset } from "../../lib/storageService";

const initialForm = {
  title: "",
  categoryId: "",
  status: "published",
  featured: false,
  tags: "",
  imageUrl: ""
};

export function AdminPhotosPage() {
  const [categories, setCategories] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  async function load() {
    const [categoryRows, photoRows] = await Promise.all([
      listCollection("categories"),
      listCollection("photos")
    ]);
    setCategories(categoryRows.filter((row) => row.isActive !== false));
    setPhotos(photoRows);
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return () => {};
    }

    const nextPreview = window.URL.createObjectURL(file);
    setPreviewUrl(nextPreview);
    return () => window.URL.revokeObjectURL(nextPreview);
  }, [file]);

  const activePhotoCategories = categories.filter((category) => category.type !== "video");
  const categoryMap = new Map(activePhotoCategories.map((category) => [category.id, category.name]));
  const filteredPhotos = photos.filter((photo) => (activeFilter === "all" ? true : photo.categoryId === activeFilter));

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      let finalImageUrl = form.imageUrl.trim();
      if (file) {
        finalImageUrl = await uploadAsset(file, "photos");
      }
      await createDocument("photos", {
        title: form.title,
        categoryId: form.categoryId,
        status: form.status,
        featured: form.featured,
        tags: form.tags
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
        imageUrl: finalImageUrl
      });
      setForm(initialForm);
      setFile(null);
      setPreviewUrl("");
      setActionError("");
      await load();
    } catch (error) {
      setActionError(error.message || "Could not save photo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Gallery</h1>
      <form onSubmit={submit} className="admin-form-stack">
        <p className="section-subtitle" style={{ marginBottom: 0 }}>
          Create category-wise gallery items. You can save using image upload or image URL.
        </p>
        <div className="grid-2">
          <input
            className="input"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
          />
          <select
            className="select"
            value={form.categoryId}
            onChange={(e) => setForm((s) => ({ ...s, categoryId: e.target.value }))}
          >
            <option value="">Select Gallery Subsection</option>
            {activePhotoCategories.map((category) => (
              <option value={category.id} key={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid-2">
          <select
            className="select"
            value={form.status}
            onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))}
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <label className="field">
            <span>Preview local image (max 5MB)</span>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>
        </div>

        {previewUrl && (
          <div className="admin-gallery-preview">
            <img src={previewUrl} alt="Selected preview" />
          </div>
        )}

        <input
          className="input"
          placeholder="Or paste image URL"
          value={form.imageUrl}
          onChange={(e) => setForm((s) => ({ ...s, imageUrl: e.target.value }))}
        />
        <input
          className="input"
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={(e) => setForm((s) => ({ ...s, tags: e.target.value }))}
        />
        <label className="field">
          <span>
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm((s) => ({ ...s, featured: e.target.checked }))}
            />{" "}
            Featured on homepage
          </span>
        </label>
        {actionError && <p className="error-text">{actionError}</p>}
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Add Gallery Item"}
        </button>
      </form>

      <div className="admin-gallery-filter">
        <select className="select" value={activeFilter} onChange={(e) => setActiveFilter(e.target.value)}>
          <option value="all">All Subsections</option>
          {activePhotoCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="admin-list">
        {filteredPhotos.map((photo) => (
          <article key={photo.id} className="admin-list-item">
            <div className="admin-gallery-item">
              <ResolvedImage src={photo.imageUrl} alt={photo.title || "Gallery photo"} className="admin-gallery-thumb" />
              <div>
                <strong>{photo.title}</strong>
                <p>
                  {(categoryMap.get(photo.categoryId) || "General")} - {photo.status}
                  {photo.featured ? " - Featured" : ""}
                </p>
              </div>
            </div>
            <div className="admin-actions">
              <button
                type="button"
                className="btn btn-soft"
                onClick={() =>
                  updateDocument("photos", photo.id, {
                    status: photo.status === "published" ? "draft" : "published"
                  })
                    .then(load)
                    .catch((error) => setActionError(error.message || "Could not update photo status."))
                }
              >
                {photo.status === "published" ? "Move to Draft" : "Publish"}
              </button>
              <button
                type="button"
                className="btn btn-soft"
                onClick={() =>
                  updateDocument("photos", photo.id, { featured: !photo.featured })
                    .then(load)
                    .catch((error) => setActionError(error.message || "Could not update featured status."))
                }
              >
                {photo.featured ? "Unfeature" : "Feature"}
              </button>
              <button
                type="button"
                className="btn btn-soft"
                onClick={() =>
                  removeDocument("photos", photo.id)
                    .then(load)
                    .catch((error) => setActionError(error.message || "Could not delete photo."))
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

