import { useEffect, useState } from "react";
import {
  createDocument,
  listCollection,
  removeDocument,
  updateDocument
} from "../../lib/firestoreService";
import { uploadAsset } from "../../lib/storageService";
import { slugify } from "../../utils/slugify";

const initialForm = {
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  coverImage: "",
  status: "published"
};

export function AdminBlogsPage() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  async function load() {
    const blogs = await listCollection("blogs");
    setRows(blogs);
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      let coverImage = form.coverImage.trim();
      if (imageFile) {
        coverImage = await uploadAsset(imageFile, "blogs");
      }

      await createDocument("blogs", {
        title: form.title,
        slug: form.slug || slugify(form.title),
        excerpt: form.excerpt,
        body: form.body,
        coverImage,
        status: form.status,
        publishedAt: new Date().toISOString()
      });
      setForm(initialForm);
      setImageFile(null);
      setActionError("");
      await load();
    } catch (error) {
      setActionError(error.message || "Could not save blog.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>VBlogs</h1>
      <form onSubmit={submit} className="admin-form-stack">
        <input
          className="input"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
        />
        <input
          className="input"
          placeholder="Slug (optional)"
          value={form.slug}
          onChange={(e) => setForm((s) => ({ ...s, slug: e.target.value }))}
        />
        <input
          className="input"
          placeholder="Excerpt"
          value={form.excerpt}
          onChange={(e) => setForm((s) => ({ ...s, excerpt: e.target.value }))}
        />
        <textarea
          className="textarea"
          rows={8}
          placeholder="Body content"
          value={form.body}
          onChange={(e) => setForm((s) => ({ ...s, body: e.target.value }))}
        />
        <div className="grid-2">
          <input
            className="input"
            placeholder="Cover image URL"
            value={form.coverImage}
            onChange={(e) => setForm((s) => ({ ...s, coverImage: e.target.value }))}
          />
          <label className="field">
            <span>Preview local cover image (max 5MB)</span>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
          </label>
        </div>
        <select
          className="select"
          value={form.status}
          onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))}
        >
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        {actionError && <p className="error-text">{actionError}</p>}
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Add Blog"}
        </button>
      </form>

      <div className="admin-list">
        {rows.map((blog) => (
          <article key={blog.id} className="admin-list-item">
            <div>
              <strong>{blog.title}</strong>
              <p>{blog.status}</p>
            </div>
            <div className="admin-actions">
              <button
                className="btn btn-soft"
                type="button"
                onClick={() =>
                  updateDocument("blogs", blog.id, {
                    status: blog.status === "published" ? "draft" : "published"
                  })
                    .then(load)
                    .catch((error) => setActionError(error.message || "Could not update blog status."))
                }
              >
                {blog.status === "published" ? "Move to Draft" : "Publish"}
              </button>
              <button
                type="button"
                className="btn btn-soft"
                onClick={() =>
                  removeDocument("blogs", blog.id)
                    .then(load)
                    .catch((error) => setActionError(error.message || "Could not delete blog."))
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

