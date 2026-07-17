import { useEffect, useState } from "react";
import { ImageDropZone } from "../../components/admin/ImageDropZone";
import { ResolvedImage } from "../../components/media/ResolvedImage";
import { createDocument, removeDocument, subscribeCollection, updateDocument } from "../../lib/firestoreService";
import { deleteStoredAsset, uploadAsset } from "../../lib/storageService";
import { slugify } from "../../utils/slugify";

const initialForm = { title: "", slug: "", excerpt: "", body: "", status: "published" };

export function AdminBlogsPage() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => subscribeCollection("blogs", setRows, (error) => setActionError(error.message)), []);
  useEffect(() => () => coverPreview && URL.revokeObjectURL(coverPreview), [coverPreview]);

  function selectCover(files) {
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverFile(files[0]);
    setCoverPreview(URL.createObjectURL(files[0]));
  }

  function clearCover() {
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverFile(null);
    setCoverPreview("");
  }

  async function submit(event) {
    event.preventDefault();
    if (!form.title.trim() || !form.body.trim()) {
      setActionError("Blog title and body are required.");
      return;
    }
    setLoading(true);
    setActionError("");
    let asset;
    try {
      if (coverFile) asset = await uploadAsset(coverFile, "blogs");
      await createDocument("blogs", {
        ...form,
        title: form.title.trim(),
        slug: form.slug.trim() || slugify(form.title),
        excerpt: form.excerpt.trim(),
        body: form.body.trim(),
        coverImage: asset?.imageUrl || "",
        storagePath: asset?.storagePath || "",
        publishedAt: new Date().toISOString()
      });
      setForm(initialForm);
      clearCover();
    } catch (error) {
      if (asset?.storagePath) deleteStoredAsset(asset.storagePath).catch(() => {});
      setActionError(error.message || "Could not save blog.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteBlog(blog) {
    setDeletingId(blog.id);
    setActionError("");
    try {
      await removeDocument("blogs", blog.id);
      await deleteStoredAsset(blog.storagePath).catch(() => {
        setActionError("Blog was deleted, but its cover file could not be cleaned up.");
      });
    } catch (error) {
      setActionError(error.message || "Could not delete blog.");
    } finally {
      setDeletingId("");
    }
  }

  return (
    <div>
      <h1>VBlogs</h1>
      <form onSubmit={submit} className="admin-form-stack">
        <input className="input" placeholder="Title" value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} />
        <input className="input" placeholder="Slug (optional)" value={form.slug} onChange={(e) => setForm((s) => ({ ...s, slug: e.target.value }))} />
        <input className="input" placeholder="Excerpt" value={form.excerpt} onChange={(e) => setForm((s) => ({ ...s, excerpt: e.target.value }))} />
        <textarea className="textarea" rows={8} placeholder="Body content" value={form.body} onChange={(e) => setForm((s) => ({ ...s, body: e.target.value }))} />
        {coverPreview ? (
          <div className="selected-image-preview">
            <img src={coverPreview} alt="Selected blog cover" />
            <button className="btn btn-danger" type="button" onClick={clearCover}>Delete</button>
          </div>
        ) : <ImageDropZone onFiles={selectCover} disabled={loading} label="Drag and drop a blog cover" />}
        <select className="select" value={form.status} onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))}>
          <option value="published">Published</option><option value="draft">Draft</option>
        </select>
        {actionError && <p className="error-text">{actionError}</p>}
        <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Saving..." : "Add Blog"}</button>
      </form>

      <div className="admin-list">
        {rows.map((blog) => (
          <article key={blog.id} className="admin-list-item">
            <div className="admin-gallery-item">
              {blog.coverImage && <ResolvedImage src={blog.coverImage} alt="" className="admin-gallery-thumb" />}
              <div><strong>{blog.title}</strong><p>{blog.status}</p></div>
            </div>
            <div className="admin-actions">
              <button className="btn btn-soft" type="button" onClick={() => updateDocument("blogs", blog.id, { status: blog.status === "published" ? "draft" : "published" }).catch((e) => setActionError(e.message))}>
                {blog.status === "published" ? "Move to Draft" : "Publish"}
              </button>
              <button className="btn btn-danger" type="button" disabled={deletingId === blog.id} onClick={() => deleteBlog(blog)}>{deletingId === blog.id ? "Deleting..." : "Delete"}</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

