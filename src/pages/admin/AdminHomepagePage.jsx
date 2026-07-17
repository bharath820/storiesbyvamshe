import { useEffect, useState } from "react";
import { ImageDropZone } from "../../components/admin/ImageDropZone";
import { ResolvedImage } from "../../components/media/ResolvedImage";
import { saveHomepageConfig, subscribeHomepageConfig } from "../../lib/firestoreService";
import { deleteStoredAsset, uploadAsset } from "../../lib/storageService";

function localId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeSlide(slide = {}) {
  return {
    localId: slide.id || localId("slide"), id: slide.id || "", imageUrl: slide.imageUrl || "",
    storagePath: slide.storagePath || "", title: slide.title || "", subtitle: slide.subtitle || "", kicker: slide.kicker || "",
    file: null, preview: ""
  };
}

function normalizeContentImage(image = {}) {
  return {
    localId: image.id || localId("content"), id: image.id || "", imageUrl: image.imageUrl || "",
    storagePath: image.storagePath || "", file: null, preview: ""
  };
}

function revokePreview(item) {
  if (item.preview) URL.revokeObjectURL(item.preview);
}

export function AdminHomepagePage() {
  const [activeSection, setActiveSection] = useState("carousel");
  const [slides, setSlides] = useState([]);
  const [contentImages, setContentImages] = useState([]);
  const [removedPaths, setRemovedPaths] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => subscribeHomepageConfig((config) => {
    setSlides((config.heroSlides || []).map(normalizeSlide));
    setContentImages((config.contentImages || []).map(normalizeContentImage));
  }, (error) => setActionError(error.message)), []);

  function updateSlide(id, patch) {
    setSlides((rows) => rows.map((row) => row.localId === id ? { ...row, ...patch } : row)); setSaved(false);
  }
  function chooseSlide(id, files) {
    setSlides((rows) => rows.map((row) => {
      if (row.localId !== id) return row;
      revokePreview(row);
      return { ...row, file: files[0], preview: URL.createObjectURL(files[0]) };
    }));
  }
  function chooseContent(id, files) {
    setContentImages((rows) => rows.map((row) => {
      if (row.localId !== id) return row;
      revokePreview(row);
      return { ...row, file: files[0], preview: URL.createObjectURL(files[0]) };
    }));
  }
  function removeItem(setter, id) {
    setter((rows) => {
      const item = rows.find((row) => row.localId === id);
      if (item) {
        revokePreview(item);
        if (item.storagePath) setRemovedPaths((paths) => [...paths, item.storagePath]);
      }
      return rows.filter((row) => row.localId !== id);
    });
    setSaved(false);
  }
  function moveItem(setter, id, direction) {
    setter((rows) => {
      const index = rows.findIndex((row) => row.localId === id);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= rows.length) return rows;
      const next = [...rows]; [next[index], next[nextIndex]] = [next[nextIndex], next[index]]; return next;
    });
    setSaved(false);
  }

  async function prepareItems(items, folder, includeText, uploadedPaths, replacedPaths) {
    const result = [];
    for (const item of items) {
      let imageUrl = item.imageUrl;
      let storagePath = item.storagePath;
      if (item.file) {
        const asset = await uploadAsset(item.file, folder);
        imageUrl = asset.imageUrl; storagePath = asset.storagePath; uploadedPaths.push(storagePath);
        if (item.storagePath) replacedPaths.push(item.storagePath);
      }
      if (!imageUrl) continue;
      const next = { id: item.id || item.localId, imageUrl, storagePath };
      if (includeText) Object.assign(next, { title: item.title.trim(), subtitle: item.subtitle.trim(), kicker: item.kicker.trim() });
      result.push(next);
    }
    return { result, uploadedPaths, replacedPaths };
  }

  async function save(event) {
    event.preventDefault(); setSaving(true); setSaved(false); setActionError("");
    let newlyUploaded = [];
    try {
      const replacedPaths = [];
      const nextSlides = await prepareItems(slides, "homepage/slides", true, newlyUploaded, replacedPaths);
      const nextContent = await prepareItems(contentImages, "homepage/content", false, newlyUploaded, replacedPaths);
      await saveHomepageConfig({ heroSlides: nextSlides.result, contentImages: nextContent.result });
      const cleanup = [...removedPaths, ...replacedPaths];
      await Promise.allSettled(cleanup.map(deleteStoredAsset));
      slides.forEach(revokePreview); contentImages.forEach(revokePreview);
      setSlides(nextSlides.result.map(normalizeSlide)); setContentImages(nextContent.result.map(normalizeContentImage));
      setRemovedPaths([]); setSaved(true);
    } catch (error) {
      await Promise.allSettled(newlyUploaded.map(deleteStoredAsset));
      setActionError(error.message || "Could not save homepage.");
    } finally { setSaving(false); }
  }

  return (
    <div>
      <h1>Homepage Config</h1>
      <form className="admin-form-stack" onSubmit={save}>
        <div className="admin-section-tabs" role="tablist" aria-label="Homepage sections">
          <button type="button" className={activeSection === "carousel" ? "is-active" : ""} onClick={() => setActiveSection("carousel")}>Carousel</button>
          <button type="button" className={activeSection === "content" ? "is-active" : ""} onClick={() => setActiveSection("content")}>Content</button>
        </div>

        {activeSection === "carousel" && <div className="field"><span>Carousel Slides</span>
          {slides.map((slide, index) => <div key={slide.localId} className="admin-homepage-row">
            <strong>Slide {index + 1}</strong>
            {slide.preview || slide.imageUrl ? <div className="selected-image-preview"><ResolvedImage src={slide.preview || slide.imageUrl} alt={`Slide ${index + 1}`} /><button className="btn btn-danger" type="button" onClick={() => removeItem(setSlides, slide.localId)}>Delete</button></div> : <ImageDropZone onFiles={(files) => chooseSlide(slide.localId, files)} disabled={saving} label="Drop a carousel image" />}
            <div className="grid-2"><input className="input" value={slide.kicker} onChange={(e) => updateSlide(slide.localId, { kicker: e.target.value })} placeholder="Kicker" /><input className="input" value={slide.title} onChange={(e) => updateSlide(slide.localId, { title: e.target.value })} placeholder="Title" /></div>
            <textarea className="textarea" rows={3} value={slide.subtitle} onChange={(e) => updateSlide(slide.localId, { subtitle: e.target.value })} placeholder="Subtitle" />
            <div className="admin-actions"><button className="btn btn-soft" type="button" onClick={() => moveItem(setSlides, slide.localId, -1)}>Move Up</button><button className="btn btn-soft" type="button" onClick={() => moveItem(setSlides, slide.localId, 1)}>Move Down</button></div>
          </div>)}
          <button className="btn btn-soft" type="button" onClick={() => setSlides((rows) => [...rows, normalizeSlide()])}>Add Slide</button>
        </div>}

        {activeSection === "content" && <div className="field"><span>Content Images</span><div className="admin-content-image-grid">
          {contentImages.map((image, index) => <article key={image.localId} className="admin-content-image-card"><strong>Image {index + 1}</strong>
            {image.preview || image.imageUrl ? <div className="selected-image-preview"><ResolvedImage src={image.preview || image.imageUrl} alt={`Content ${index + 1}`} /><button className="btn btn-danger" type="button" onClick={() => removeItem(setContentImages, image.localId)}>Delete</button></div> : <ImageDropZone onFiles={(files) => chooseContent(image.localId, files)} disabled={saving} label="Drop a content image" />}
            <div className="admin-actions"><button className="btn btn-soft" type="button" onClick={() => moveItem(setContentImages, image.localId, -1)}>Move Up</button><button className="btn btn-soft" type="button" onClick={() => moveItem(setContentImages, image.localId, 1)}>Move Down</button></div>
          </article>)}
        </div><button className="btn btn-soft" type="button" onClick={() => setContentImages((rows) => [...rows, normalizeContentImage()])}>Add Content Image</button></div>}

        {actionError && <p className="error-text">{actionError}</p>}
        <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? "Saving..." : "Save Homepage"}</button>
        {saved && <p className="ok-text">Homepage saved successfully.</p>}
      </form>
    </div>
  );
}
