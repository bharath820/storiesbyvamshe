import { useEffect, useMemo, useState } from "react";
import { CategoryTabs } from "../components/filters/CategoryTabs";
import { SearchBox } from "../components/filters/SearchBox";
import { MasonryGrid } from "../components/media/MasonryGrid";
import { PhotoCard } from "../components/media/PhotoCard";
import { usePaginatedSlice } from "../hooks/usePaginatedSlice";
import { getPublishedCategories, getPublishedPhotos } from "../lib/firestoreService";
import { subscribeToContentChanges } from "../lib/localDataStore";

export function GalleryPage() {
  const [categories, setCategories] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    let isActive = true;

    async function load() {
      const [categoryRows, photoRows] = await Promise.all([getPublishedCategories(), getPublishedPhotos()]);
      if (!isActive) return;
      const catMap = new Map(categoryRows.map((c) => [c.id, c.name]));
      setCategories(categoryRows);
      setPhotos(
        photoRows.map((photo) => ({
          ...photo,
          categoryName: catMap.get(photo.categoryId) || "General"
        }))
      );
    }

    load().catch(() => {});
    const unsubscribe = subscribeToContentChanges(() => {
      load().catch(() => {});
    });

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, []);

  const filtered = useMemo(() => {
    return photos.filter((photo) => {
      const categoryMatch = activeCategory === "all" ? true : photo.categoryId === activeCategory;
      const text = `${photo.title || ""} ${photo.categoryName || ""}`.toLowerCase();
      const searchMatch = text.includes(search.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [photos, activeCategory, search]);

  const { visible, hasMore, loadMore, reset } = usePaginatedSlice(filtered, 12);

  useEffect(() => {
    reset();
  }, [activeCategory, search, reset]);

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">Gallery</h1>
        <p className="section-subtitle">Browse category-wise photo stories with aligned masonry cards.</p>
        <div className="filters-row">
          <CategoryTabs categories={categories} active={activeCategory} onChange={setActiveCategory} allowAll />
          <SearchBox value={search} onChange={setSearch} placeholder="Search by title or category..." />
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
