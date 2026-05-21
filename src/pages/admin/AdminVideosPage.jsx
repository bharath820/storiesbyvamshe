import { useEffect, useState } from "react";
import {
  createDocument,
  listCollection,
  removeDocument,
  updateDocument
} from "../../lib/firestoreService";

const initialForm = {
  title: "",
  categoryId: "",
  sourceType: "link",
  mediaUrl: "",
  thumbnailUrl: "",
  status: "published"
};

export function AdminVideosPage() {
  const [categories, setCategories] = useState([]);
  const [videos, setVideos] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  async function load() {
    const [categoryRows, videoRows] = await Promise.all([
      listCollection("categories"),
      listCollection("videos")
    ]);
    setCategories(categoryRows.filter((row) => row.isActive !== false));
    setVideos(videoRows);
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      await createDocument("videos", {
        title: form.title,
        categoryId: form.categoryId,
        sourceType: "link",
        mediaUrl: form.mediaUrl.trim(),
        thumbnailUrl: form.thumbnailUrl.trim(),
        status: form.status
      });
      setForm(initialForm);
      setActionError("");
      await load();
    } catch (error) {
      setActionError(error.message || "Could not save video.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Videos</h1>
      <form className="admin-form-stack" onSubmit={submit}>
        <div className="grid-2">
          <input
            className="input"
            placeholder="Video title"
            value={form.title}
            onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
          />
          <select
            className="select"
            value={form.categoryId}
            onChange={(e) => setForm((s) => ({ ...s, categoryId: e.target.value }))}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option value={category.id} key={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid-2">
          <input className="input" value="Link (YouTube/Vimeo embed)" readOnly />
          <select
            className="select"
            value={form.status}
            onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))}
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <input
          className="input"
          placeholder="Embed URL"
          value={form.mediaUrl}
          onChange={(e) => setForm((s) => ({ ...s, mediaUrl: e.target.value }))}
        />
        <p className="section-subtitle">Video file upload is temporarily disabled in static mode.</p>

        <input
          className="input"
          placeholder="Thumbnail URL (optional)"
          value={form.thumbnailUrl}
          onChange={(e) => setForm((s) => ({ ...s, thumbnailUrl: e.target.value }))}
        />

        {actionError && <p className="error-text">{actionError}</p>}
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Add Video"}
        </button>
      </form>

      <div className="admin-list">
        {videos.map((video) => (
          <article key={video.id} className="admin-list-item">
            <div>
              <strong>{video.title}</strong>
              <p>
                {video.sourceType} - {video.status}
              </p>
            </div>
            <div className="admin-actions">
              <button
                className="btn btn-soft"
                type="button"
                onClick={() =>
                  updateDocument("videos", video.id, {
                    status: video.status === "published" ? "draft" : "published"
                  })
                    .then(load)
                    .catch((error) => setActionError(error.message || "Could not update video status."))
                }
              >
                {video.status === "published" ? "Move to Draft" : "Publish"}
              </button>
              <button
                type="button"
                className="btn btn-soft"
                onClick={() =>
                  removeDocument("videos", video.id)
                    .then(load)
                    .catch((error) => setActionError(error.message || "Could not delete video."))
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

