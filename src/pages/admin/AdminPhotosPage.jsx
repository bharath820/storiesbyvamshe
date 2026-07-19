import { useEffect, useMemo, useState } from "react";
import { ImageDropZone } from "../../components/admin/ImageDropZone";
import { ResolvedImage } from "../../components/media/ResolvedImage";
import { createDocument, removeDocument, subscribeCollection } from "../../lib/firestoreService";
import { deleteStoredAsset, uploadAsset } from "../../lib/storageService";
import { buildCategoryNameLookup, getItemCategoryName, itemMatchesCategory } from "../../utils/categoryMatching";

function uploadKey(file) {
  return `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 7)}`;
}

const MAX_PARALLEL_GALLERY_UPLOADS = 4;

function uploadStatusText(upload) {
  if (upload.status === "queued") return "Waiting";
  if (upload.status === "preparing") return "Preparing";
  if (upload.status === "complete") return "Uploaded";
  if (upload.status === "error") return upload.error;
  return `${upload.progress}%`;
}

async function runWithConcurrency(items, limit, task) {
  let nextIndex = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      await task(items[currentIndex], currentIndex);
    }
  });
  await Promise.all(workers);
}

export function AdminPhotosPage() {
  const [categories, setCategories] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [categoryId, setCategoryId] = useState("");
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
  const selectedCategory = useMemo(
    () => photoCategories.find((category) => category.id === categoryId) || null,
    [photoCategories, categoryId]
  );
  const categoryNameLookup = useMemo(() => buildCategoryNameLookup(photoCategories), [photoCategories]);
  const filteredPhotos = useMemo(
    () => selectedCategory ? photos.filter((photo) => itemMatchesCategory(photo, selectedCategory)) : [],
    [photos, selectedCategory]
  );

  useEffect(() => {
    if (categoryId && !photoCategories.some((category) => category.id === categoryId)) {
      setCategoryId("");
    }
  }, [categoryId, photoCategories]);

  async function uploadFiles(files) {
    if (!selectedCategory) {
      setActionError("Select a gallery subsection before adding images.");
      return;
    }
    const uploadCategory = selectedCategory;
    setActionError("");
    const pending = files.map((file) => ({ key: uploadKey(file), name: file.name, progress: 0, status: "queued" }));
    setUploads((rows) => [...pending, ...rows].slice(0, 24));

    await runWithConcurrency(pending, MAX_PARALLEL_GALLERY_UPLOADS, async (item, index) => {
      const file = files[index];
      let asset;
      try {
        setUploads((rows) => rows.map((row) => row.key === item.key ? { ...row, status: "preparing", progress: 0 } : row));
        asset = await uploadAsset(file, "gallery", (progress) => {
          setUploads((rows) => rows.map((row) => row.key === item.key ? { ...row, status: "uploading", progress } : row));
        });
        await createDocument("photos", {
          categoryId: uploadCategory.id,
          categorySlug: uploadCategory.slug || "",
          categoryName: uploadCategory.name || "",
          imageUrl: asset.imageUrl,
          storagePath: asset.storagePath,
          status: "published"
        });
        setUploads((rows) => rows.filter((row) => row.key !== item.key));
      } catch (error) {
        if (asset?.storagePath) deleteStoredAsset(asset.storagePath).catch(() => {});
        setUploads((rows) => rows.map((row) => row.key === item.key ? {
          ...row,
          status: "error",
          error: error.message || "Upload failed."
        } : row));
      }
    });
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
          <select className="select" value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
            <option value="">Select Gallery Subsection</option>
            {photoCategories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}
          </select>
        </label>
        <ImageDropZone multiple disabled={!categoryId} onFiles={uploadFiles} label="Drop gallery images or click to choose files" />
        {uploads.length > 0 && (
          <div className="upload-status-list" aria-live="polite">
            {uploads.map((upload) => (
              <div key={upload.key} className={`upload-status upload-status--${upload.status}`}>
                <span>{upload.name}</span>
                <span>{uploadStatusText(upload)}</span>
              </div>
            ))}
          </div>
        )}
        {actionError && <p className="error-text">{actionError}</p>}
      </div>

      {selectedCategory && filteredPhotos.length > 0 && (
        <div className="admin-media-grid">
          {filteredPhotos.map((photo) => {
            const categoryName = getItemCategoryName(photo, categoryNameLookup, selectedCategory.name || "General");
            return (
              <article key={photo.id} className="admin-media-card">
                <ResolvedImage src={photo.imageUrl} alt={`${categoryName} image`} />
                <div className="admin-media-card__footer">
                  <span>{categoryName}</span>
                  <button className="btn btn-danger" type="button" disabled={deletingId === photo.id} onClick={() => deletePhoto(photo)}>
                    {deletingId === photo.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
