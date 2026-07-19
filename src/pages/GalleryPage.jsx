import { useEffect, useMemo, useState } from "react";
import { CategoryTabs } from "../components/filters/CategoryTabs";
import { MasonryGrid } from "../components/media/MasonryGrid";
import { PhotoCard } from "../components/media/PhotoCard";
import { usePaginatedSlice } from "../hooks/usePaginatedSlice";
import { subscribePublishedCategories, subscribePublishedCollection } from "../lib/firestoreService";

const GALLERY_CATEGORY_ORDER = [
  "engagement",
  "prewedding",
  "sangeeth",
  "haldhi",
  "wedding",
  "reception",
  "birthday",
  "babyshoot"
];

function normalizeCategoryName(category) {
  return String(category.slug || category.name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export function GalleryPage() {
  const [categories, setCategories] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {
    let categoryRows = [];
    let photoRows = [];
    const sync = () => {
      const galleryCategories = categoryRows
        .filter((category) => GALLERY_CATEGORY_ORDER.includes(normalizeCategoryName(category)))
        .sort(
          (a, b) =>
            GALLERY_CATEGORY_ORDER.indexOf(normalizeCategoryName(a)) -
            GALLERY_CATEGORY_ORDER.indexOf(normalizeCategoryName(b))
        );
      const catMap = new Map(galleryCategories.map((category) => [category.id, category.name]));
      setCategories(galleryCategories);
      setPhotos(
        [...photoRows]
          .filter((photo) => catMap.has(photo.categoryId))
          .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))
          .map((photo) => ({ ...photo, categoryName: catMap.get(photo.categoryId) }))
      );
    };
    const stopCategories = subscribePublishedCategories((rows) => { categoryRows = rows; sync(); });
    const stopPhotos = subscribePublishedCollection("photos", (rows) => { photoRows = rows; sync(); });
    return () => {
      stopCategories();
      stopPhotos();
    };
  }, []);

  useEffect(() => {
    if (!categories.some((category) => category.id === activeCategory)) {
      setActiveCategory(categories[0]?.id || "");
    }
  }, [categories, activeCategory]);

  const filtered = useMemo(() => {
    return photos.filter((photo) => photo.categoryId === activeCategory);
  }, [photos, activeCategory]);

  const { visible, hasMore, loadMore, reset } = usePaginatedSlice(filtered, 12);

  useEffect(() => {
    reset();
  }, [activeCategory, reset]);

  return (
    <section className="section gallery-page">
      <div className="container">
        <div className="filters-row filters-row--gallery">
          <CategoryTabs categories={categories} active={activeCategory} onChange={setActiveCategory} allowAll={false} />
        </div>
        <MasonryGrid>
          {visible.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} />
          ))}
        </MasonryGrid>
        {hasMore && (
          <div className="load-more-row">
            <button type="button" className="btn btn-soft" onClick={loadMore}>
              Load More
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
