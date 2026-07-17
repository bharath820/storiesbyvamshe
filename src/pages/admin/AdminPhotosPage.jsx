import { useEffect, useMemo, useState } from "react";
import { ImageDropZone } from "../../components/admin/ImageDropZone";
import { ResolvedImage } from "../../components/media/ResolvedImage";
import { createDocument, removeDocument, subscribeCollection } from "../../lib/firestoreService";
import { deleteStoredAsset, uploadAsset } from "../../lib/storageService";

function uploadKey(file) {
  return `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 7)}`;
}

export function AdminPhotosPage() {
  const [categories, setCategories] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [uploads, setUploads] = useState([]);
  const [deletingId, setDeletingId] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    const stopCategories = subscribeCollection("categories", setCategories, (error) => setActionError(error.message));
    const stopPhotos = subscribeCollection("photos", setPhotos, (error) => setActionError(error.message));
    return () => {
      stopCategories();
      stopPhotos();
    };
  }, []);

  const photoCategories = useMemo(
    () => categories.filter((category) => category.isActive !== false && category.type !== "video"),
    [categories]
  );
  const categoryMap = useMemo(() => new Map(photoCategories.map((category) => [category.id, category.name])), [photoCategories]);
  const filteredPhotos = photos.filter((photo) => activeFilter === "all" || photo.categoryId === activeFilter);
  const isUploading = uploads.some((item) => item.status === "uploading");

  async function uploadFiles(files) {
    if (!categoryId) {
      setActionError("Select a gallery subsection before adding images.");
      return;
    }
    setActionError("");
    const pending = files.map((file) => ({ key: uploadKey(file), name: file.name, progress: 0, status: "uploading" }));
    setUploads((rows) => [...pending, ...rows].slice(0, 12));

    await Promise.all(pending.map(async (item, index) => {
      const file = files[index];
      let asset;
      try {
        asset = await uploadAsset(file, "gallery", (progress) => {
          setUploads((rows) => rows.map((row) => row.key === item.key ? { ...row, progress } : row));
        });
        await createDocument("photos", {
          categoryId,
          imageUrl: asset.imageUrl,
          storagePath: asset.storagePath,
          status: "published"
        });
        setUploads((rows) => rows.map((row) => row.key === item.key ? { ...row, progress: 100, status: "complete" } : row));
      } catch (error) {
        if (asset?.storagePath) deleteStoredAsset(asset.storagePath).catch(() => {});
        setUploads((rows) => rows.map((row) => row.key === item.key ? {
          ...row,
          status: "error",
          error: error.message || "Upload failed."
        } : row));
      }
    }));
  }

  async function deletePhoto(photo) {
    setDeletingId(photo.id);
    setActionError("");
    try {
      await removeDocument("photos", photo.id);
      try {
        await deleteStoredAsset(photo.storagePath);
      } catch {
        setActionError("Image was removed from the gallery, but its stored file could not be cleaned up.");
      }
    } catch (error) {
      setActionError(error.message || "Could not delete image.");
    } finally {
      setDeletingId("");
    }
  }

  return (
    <div>
      <h1>Gallery</h1>
      <div className="admin-form-stack">
        <label className="field">
          <span>Gallery subsection</span>
          <select className="select" value={categoryId} onChange={(event) => setCategoryId(event.target.value)} disabled={isUploading}>
            <option value="">Select Gallery Subsection</option>
            {photoCategories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}
          </select>
        </label>
        <ImageDropZone multiple disabled={!categoryId || isUploading} onFiles={uploadFiles} label="Drag and drop gallery images" />
        {uploads.length > 0 && (
          <div className="upload-status-list" aria-live="polite">
            {uploads.map((upload) => (
              <div key={upload.key} className={`upload-status upload-status--${upload.status}`}>
                <span>{upload.name}</span>
                <span>{upload.status === "error" ? upload.error : upload.status === "complete" ? "Uploaded" : `${upload.progress}%`}</span>
              </div>
            ))}
          </div>
        )}
        {actionError && <p className="error-text">{actionError}</p>}
      </div>

      <div className="admin-gallery-filter">
        <select className="select" value={activeFilter} onChange={(event) => setActiveFilter(event.target.value)}>
          <option value="all">All Subsections</option>
          {photoCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </select>
      </div>

      <div className="admin-media-grid">
        {filteredPhotos.map((photo) => (
          <article key={photo.id} className="admin-media-card">
            <ResolvedImage src={photo.imageUrl} alt={`${categoryMap.get(photo.categoryId) || "Gallery"} image`} />
            <div className="admin-media-card__footer">
              <span>{categoryMap.get(photo.categoryId) || "General"}</span>
              <button className="btn btn-danger" type="button" disabled={deletingId === photo.id} onClick={() => deletePhoto(photo)}>
                {deletingId === photo.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

