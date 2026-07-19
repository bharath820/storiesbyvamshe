import { useEffect, useMemo, useState } from "react";
import { CategoryTabs } from "../components/filters/CategoryTabs";
import { VideoCard } from "../components/media/VideoCard";
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

export function VideosPage() {
  const [categories, setCategories] = useState([]);
  const [videos, setVideos] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {
    let categoryRows = [];
    let videoRows = [];
    function sync() {
      const galleryCategories = categoryRows
        .filter((category) => GALLERY_CATEGORY_ORDER.includes(normalizeCategoryName(category)))
        .sort(
          (a, b) =>
            GALLERY_CATEGORY_ORDER.indexOf(normalizeCategoryName(a)) -
            GALLERY_CATEGORY_ORDER.indexOf(normalizeCategoryName(b))
        );
      const catMap = new Map(galleryCategories.map((category) => [category.id, category.name]));
      setCategories(galleryCategories);
      setVideos(
        [...videoRows]
          .filter((video) => catMap.has(video.categoryId))
          .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))
          .map((video) => ({
            ...video,
            categoryName: catMap.get(video.categoryId)
          }))
      );
    }
    const stopCategories = subscribePublishedCategories((rows) => { categoryRows = rows; sync(); });
    const stopVideos = subscribePublishedCollection("videos", (rows) => { videoRows = rows; sync(); });
    return () => {
      stopCategories(); stopVideos();
    };
  }, []);

  useEffect(() => {
    if (!categories.some((category) => category.id === activeCategory)) {
      setActiveCategory(categories[0]?.id || "");
    }
  }, [categories, activeCategory]);

  const filtered = useMemo(() => {
    return videos.filter((video) => video.categoryId === activeCategory);
  }, [videos, activeCategory]);

  return (
    <section className="section">
      <div className="container">
        <div className="filters-row filters-row--gallery">
          <CategoryTabs categories={categories} active={activeCategory} onChange={setActiveCategory} allowAll={false} />
        </div>
        <div className="video-grid">
          {filtered.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    </section>
  );
}
