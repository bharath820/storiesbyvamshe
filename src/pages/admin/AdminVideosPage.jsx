import { useEffect, useMemo, useState } from "react";
import { ImageDropZone } from "../../components/admin/ImageDropZone";
import { ResolvedImage } from "../../components/media/ResolvedImage";
import { createDocument, removeDocument, subscribeCollection, updateDocument } from "../../lib/firestoreService";
import { deleteStoredAsset, uploadAsset } from "../../lib/storageService";

const initialForm = { title: "", categoryId: "", mediaUrl: "", status: "published" };

export function AdminVideosPage() {
  const [categories, setCategories] = useState([]);
  const [videos, setVideos] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    const stopCategories = subscribeCollection("categories", setCategories, (e) => setActionError(e.message));
    const stopVideos = subscribeCollection("videos", setVideos, (e) => setActionError(e.message));
    return () => { stopCategories(); stopVideos(); };
  }, []);
  useEffect(() => () => thumbnailPreview && URL.revokeObjectURL(thumbnailPreview), [thumbnailPreview]);
  const videoCategories = useMemo(() => categories.filter((c) => c.isActive !== false && c.type !== "photo"), [categories]);

  function selectThumbnail(files) {
    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    setThumbnailFile(files[0]);
    setThumbnailPreview(URL.createObjectURL(files[0]));
  }
  function clearThumbnail() {
    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    setThumbnailFile(null); setThumbnailPreview("");
  }

  async function submit(event) {
    event.preventDefault();
    if (!form.title.trim() || !form.mediaUrl.trim()) {
      setActionError("Video title and URL are required.");
      return;
    }
    setLoading(true); setActionError("");
    let asset;
    try {
      if (thumbnailFile) asset = await uploadAsset(thumbnailFile, "video-thumbnails");
      await createDocument("videos", {
        ...form,
        title: form.title.trim(), mediaUrl: form.mediaUrl.trim(), sourceType: "link",
        thumbnailUrl: asset?.imageUrl || "", storagePath: asset?.storagePath || ""
      });
      setForm(initialForm); clearThumbnail();
    } catch (error) {
      if (asset?.storagePath) deleteStoredAsset(asset.storagePath).catch(() => {});
      setActionError(error.message || "Could not save video.");
    } finally { setLoading(false); }
  }

  async function deleteVideo(video) {
    setDeletingId(video.id); setActionError("");
    try {
      await removeDocument("videos", video.id);
      await deleteStoredAsset(video.storagePath).catch(() => setActionError("Video was deleted, but its thumbnail file could not be cleaned up."));
    } catch (error) { setActionError(error.message || "Could not delete video."); }
    finally { setDeletingId(""); }
  }

  return (
    <div>
      <h1>Videos</h1>
      <form className="admin-form-stack" onSubmit={submit}>
        <div className="grid-2">
          <input className="input" placeholder="Video title" value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} />
          <select className="select" value={form.categoryId} onChange={(e) => setForm((s) => ({ ...s, categoryId: e.target.value }))}>
            <option value="">Select Category</option>{videoCategories.map((c) => <option value={c.id} key={c.id}>{c.name}</option>)}
          </select>
        </div>
        <input className="input" placeholder="YouTube or Vimeo video URL" value={form.mediaUrl} onChange={(e) => setForm((s) => ({ ...s, mediaUrl: e.target.value }))} />
        {thumbnailPreview ? (
          <div className="selected-image-preview"><img src={thumbnailPreview} alt="Selected video thumbnail" /><button className="btn btn-danger" type="button" onClick={clearThumbnail}>Delete</button></div>
        ) : <ImageDropZone onFiles={selectThumbnail} disabled={loading} label="Drag and drop an optional video thumbnail" />}
        <select className="select" value={form.status} onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))}><option value="published">Published</option><option value="draft">Draft</option></select>
        {actionError && <p className="error-text">{actionError}</p>}
        <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Saving..." : "Add Video"}</button>
      </form>
      <div className="admin-list">
        {videos.map((video) => (
          <article key={video.id} className="admin-list-item">
            <div className="admin-gallery-item">{video.thumbnailUrl && <ResolvedImage src={video.thumbnailUrl} alt="" className="admin-gallery-thumb" />}<div><strong>{video.title}</strong><p>{video.status}</p></div></div>
            <div className="admin-actions">
              <button className="btn btn-soft" type="button" onClick={() => updateDocument("videos", video.id, { status: video.status === "published" ? "draft" : "published" }).catch((e) => setActionError(e.message))}>{video.status === "published" ? "Move to Draft" : "Publish"}</button>
              <button className="btn btn-danger" type="button" disabled={deletingId === video.id} onClick={() => deleteVideo(video)}>{deletingId === video.id ? "Deleting..." : "Delete"}</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
