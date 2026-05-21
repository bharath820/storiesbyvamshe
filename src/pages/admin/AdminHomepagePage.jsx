import { useEffect, useState } from "react";
import { ResolvedImage } from "../../components/media/ResolvedImage";
import { getHomepageConfig, saveHomepageConfig } from "../../lib/firestoreService";
import { uploadAsset } from "../../lib/storageService";

function createLocalSlideId() {
  return `slide-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createLocalContentImageId() {
  return `content-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeHeroSlide(slide) {
  if (typeof slide === "string") {
    const [imageUrl = "", title = "", subtitle = "", kicker = ""] = slide.split("|");
    return { localId: createLocalSlideId(), imageUrl: imageUrl.trim(), title, subtitle, kicker };
  }

  if (!slide || typeof slide !== "object") {
    return null;
  }

  return {
    localId: slide.id || createLocalSlideId(),
    id: slide.id,
    imageUrl: (slide.imageUrl || "").trim(),
    title: slide.title || "",
    subtitle: slide.subtitle || "",
    kicker: slide.kicker || ""
  };
}

function normalizeContentImage(image) {
  if (typeof image === "string") {
    return { localId: createLocalContentImageId(), imageUrl: image.trim() };
  }

  if (!image || typeof image !== "object") {
    return null;
  }

  return {
    localId: image.id || createLocalContentImageId(),
    id: image.id,
    imageUrl: (image.imageUrl || "").trim()
  };
}

function createObjectUrl(file) {
  if (!file || typeof window === "undefined" || !window.URL?.createObjectURL) {
    return "";
  }
  return window.URL.createObjectURL(file);
}

export function AdminHomepagePage() {
  const [activeSection, setActiveSection] = useState("carousel");
  const [heroSlides, setHeroSlides] = useState([]);
  const [slideFiles, setSlideFiles] = useState({});
  const [slidePreviews, setSlidePreviews] = useState({});
  const [contentImages, setContentImages] = useState([]);
  const [contentFiles, setContentFiles] = useState({});
  const [contentPreviews, setContentPreviews] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    async function load() {
      const config = await getHomepageConfig();
      const slides = (config.heroSlides || [])
        .map((slide) => normalizeHeroSlide(slide))
        .filter(Boolean);
      const images = (config.contentImages || [])
        .map((image) => normalizeContentImage(image))
        .filter(Boolean);
      setHeroSlides(slides);
      setSlideFiles({});
      setSlidePreviews({});
      setContentImages(images);
      setContentFiles({});
      setContentPreviews({});
    }
    load();
  }, []);

  function updateSlide(localId, updates) {
    setHeroSlides((rows) => rows.map((row) => (row.localId === localId ? { ...row, ...updates } : row)));
    setSaved(false);
  }

  function selectSlideFile(localId, file) {
    setSlideFiles((rows) => ({
      ...rows,
      [localId]: file || null
    }));
    setSlidePreviews((rows) => {
      if (rows[localId]) {
        window.URL?.revokeObjectURL?.(rows[localId]);
      }
      const next = { ...rows };
      if (file) {
        next[localId] = createObjectUrl(file);
      } else {
        delete next[localId];
      }
      return next;
    });
    setSaved(false);
  }

  function addSlide() {
    setHeroSlides((rows) => [...rows, normalizeHeroSlide({})]);
    setSaved(false);
  }

  function removeSlide(localId) {
    setHeroSlides((rows) => rows.filter((row) => row.localId !== localId));
    setSlideFiles((rows) => {
      const next = { ...rows };
      delete next[localId];
      return next;
    });
    setSlidePreviews((rows) => {
      if (rows[localId]) {
        window.URL?.revokeObjectURL?.(rows[localId]);
      }
      const next = { ...rows };
      delete next[localId];
      return next;
    });
    setSaved(false);
  }

  function moveSlide(localId, direction) {
    setHeroSlides((rows) => {
      const index = rows.findIndex((row) => row.localId === localId);
      if (index < 0) return rows;
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= rows.length) return rows;
      const next = [...rows];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
    setSaved(false);
  }

  function addContentImage() {
    setContentImages((rows) => [...rows, normalizeContentImage({})]);
    setSaved(false);
  }

  function removeContentImage(localId) {
    setContentImages((rows) => rows.filter((row) => row.localId !== localId));
    setContentFiles((rows) => {
      const next = { ...rows };
      delete next[localId];
      return next;
    });
    setContentPreviews((rows) => {
      if (rows[localId]) {
        window.URL?.revokeObjectURL?.(rows[localId]);
      }
      const next = { ...rows };
      delete next[localId];
      return next;
    });
    setSaved(false);
  }

  function moveContentImage(localId, direction) {
    setContentImages((rows) => {
      const index = rows.findIndex((row) => row.localId === localId);
      if (index < 0) return rows;
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= rows.length) return rows;
      const next = [...rows];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
    setSaved(false);
  }

  function selectContentFile(localId, file) {
    setContentFiles((rows) => ({
      ...rows,
      [localId]: file || null
    }));
    setContentPreviews((rows) => {
      if (rows[localId]) {
        window.URL?.revokeObjectURL?.(rows[localId]);
      }
      const next = { ...rows };
      if (file) {
        next[localId] = createObjectUrl(file);
      } else {
        delete next[localId];
      }
      return next;
    });
    setSaved(false);
  }

  async function onSave(event) {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    setActionError("");

    try {
      const nextHeroSlides = [];
      for (const slide of heroSlides) {
        let finalImageUrl = slide.imageUrl.trim();
        const selectedFile = slideFiles[slide.localId];
        if (selectedFile) {
          finalImageUrl = await uploadAsset(selectedFile, "homepage");
        }
        if (!finalImageUrl) continue;
        nextHeroSlides.push({
          id: slide.id || slide.localId,
          imageUrl: finalImageUrl,
          title: slide.title.trim(),
          subtitle: slide.subtitle.trim(),
          kicker: slide.kicker.trim()
        });
      }

      const nextContentImages = [];
      for (const image of contentImages) {
        let finalImageUrl = image.imageUrl.trim();
        const selectedFile = contentFiles[image.localId];
        if (selectedFile) {
          finalImageUrl = await uploadAsset(selectedFile, "homepage-content");
        }
        if (!finalImageUrl) continue;
        nextContentImages.push({
          id: image.id || image.localId,
          imageUrl: finalImageUrl
        });
      }

      await saveHomepageConfig({ heroSlides: nextHeroSlides, contentImages: nextContentImages });
      Object.values(slidePreviews).forEach((url) => window.URL?.revokeObjectURL?.(url));
      Object.values(contentPreviews).forEach((url) => window.URL?.revokeObjectURL?.(url));
      setHeroSlides(nextHeroSlides.map((slide) => normalizeHeroSlide(slide)).filter(Boolean));
      setSlideFiles({});
      setSlidePreviews({});
      setContentImages(nextContentImages.map((image) => normalizeContentImage(image)).filter(Boolean));
      setContentFiles({});
      setContentPreviews({});
      setSaved(true);
    } catch (error) {
      setActionError(error.message || "Could not save homepage config.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1>Homepage Config</h1>
      <form className="admin-form-stack" onSubmit={onSave}>
        <div className="admin-section-tabs" role="tablist" aria-label="Homepage sections">
          <button
            type="button"
            className={activeSection === "carousel" ? "is-active" : ""}
            onClick={() => setActiveSection("carousel")}
          >
            Carousel
          </button>
          <button
            type="button"
            className={activeSection === "content" ? "is-active" : ""}
            onClick={() => setActiveSection("content")}
          >
            Content
          </button>
        </div>

        {activeSection === "carousel" && (
          <div className="field">
            <span>Carousel Slides</span>
            {heroSlides.map((slide, index) => (
              <div key={slide.localId} className="admin-homepage-row">
                <div className="admin-homepage-row__header">
                  <strong>Slide {index + 1}</strong>
                  {(slidePreviews[slide.localId] || slide.imageUrl) && (
                    <ResolvedImage
                      src={slidePreviews[slide.localId] || slide.imageUrl}
                      alt={`Slide ${index + 1} preview`}
                      className="admin-homepage-thumb"
                    />
                  )}
                </div>
                <div className="grid-2" style={{ width: "100%" }}>
                  <label className="field">
                    <span>Preview local image (max 5MB)</span>
                    <input type="file" accept="image/*" onChange={(e) => selectSlideFile(slide.localId, e.target.files?.[0] || null)} />
                  </label>
                  <label className="field">
                    <span>Paste image URL (optional)</span>
                    <input
                      className="input"
                      value={slide.imageUrl}
                      onChange={(e) => updateSlide(slide.localId, { imageUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </label>
                </div>
                <div className="grid-2" style={{ width: "100%" }}>
                  <input
                    className="input"
                    value={slide.kicker}
                    onChange={(e) => updateSlide(slide.localId, { kicker: e.target.value })}
                    placeholder="Kicker"
                  />
                  <input
                    className="input"
                    value={slide.title}
                    onChange={(e) => updateSlide(slide.localId, { title: e.target.value })}
                    placeholder="Title"
                  />
                </div>
                <textarea
                  className="textarea"
                  rows={3}
                  value={slide.subtitle}
                  onChange={(e) => updateSlide(slide.localId, { subtitle: e.target.value })}
                  placeholder="Subtitle"
                />
                <div className="admin-actions">
                  <button type="button" className="btn btn-soft" onClick={() => moveSlide(slide.localId, -1)}>
                    Move Up
                  </button>
                  <button type="button" className="btn btn-soft" onClick={() => moveSlide(slide.localId, 1)}>
                    Move Down
                  </button>
                  <button type="button" className="btn btn-soft" onClick={() => removeSlide(slide.localId)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button type="button" className="btn btn-soft" onClick={addSlide}>
              Add Slide
            </button>
          </div>
        )}

        {activeSection === "content" && (
          <div className="field">
            <span>Content Images</span>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>
              Upload the images that should appear on the homepage below the carousel.
            </p>
            <div className="admin-content-image-grid">
              {contentImages.map((image, index) => (
                <article key={image.localId} className="admin-content-image-card">
                  <div className="admin-content-image-card__preview">
                    {contentPreviews[image.localId] || image.imageUrl ? (
                      <ResolvedImage src={contentPreviews[image.localId] || image.imageUrl} alt={`Content ${index + 1} preview`} />
                    ) : (
                      <span>No image selected</span>
                    )}
                  </div>
                  <strong>Image {index + 1}</strong>
                  <label className="field">
                    <span>Upload image (max 5MB)</span>
                    <input type="file" accept="image/*" onChange={(e) => selectContentFile(image.localId, e.target.files?.[0] || null)} />
                  </label>
                  <label className="field">
                    <span>Paste image URL (optional)</span>
                    <input
                      className="input"
                      value={image.imageUrl}
                      onChange={(e) =>
                        setContentImages((rows) =>
                          rows.map((row) => (row.localId === image.localId ? { ...row, imageUrl: e.target.value } : row))
                        )
                      }
                      placeholder="https://..."
                    />
                  </label>
                  <div className="admin-actions">
                    <button type="button" className="btn btn-soft" onClick={() => moveContentImage(image.localId, -1)}>
                      Move Up
                    </button>
                    <button type="button" className="btn btn-soft" onClick={() => moveContentImage(image.localId, 1)}>
                      Move Down
                    </button>
                    <button type="button" className="btn btn-soft" onClick={() => removeContentImage(image.localId)}>
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <button type="button" className="btn btn-soft" onClick={addContentImage}>
              Add Content Image
            </button>
          </div>
        )}

        {actionError && <p className="error-text">{actionError}</p>}
        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Homepage"}
        </button>
        {saved && <p className="ok-text">Homepage configuration saved successfully.</p>}
      </form>
    </div>
  );
}

