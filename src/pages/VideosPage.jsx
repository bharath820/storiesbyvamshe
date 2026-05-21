import { useEffect, useMemo, useState } from "react";
import { CategoryTabs } from "../components/filters/CategoryTabs";
import { SearchBox } from "../components/filters/SearchBox";
import { VideoCard } from "../components/media/VideoCard";
import { getPublishedCategories, getPublishedVideos } from "../lib/firestoreService";
import { subscribeToContentChanges } from "../lib/localDataStore";

export function VideosPage() {
  const [categories, setCategories] = useState([]);
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    let isActive = true;

    async function load() {
      const [categoryRows, videoRows] = await Promise.all([getPublishedCategories(), getPublishedVideos()]);
      if (!isActive) return;
      const catMap = new Map(categoryRows.map((c) => [c.id, c.name]));
      setCategories(categoryRows);
      setVideos(
        videoRows.map((video) => ({
          ...video,
          categoryName: catMap.get(video.categoryId) || "General"
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
    return videos.filter((video) => {
      const categoryMatch = activeCategory === "all" ? true : video.categoryId === activeCategory;
      const text = `${video.title || ""} ${video.categoryName || ""}`.toLowerCase();
      const searchMatch = text.includes(search.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [videos, activeCategory, search]);

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">Videos</h1>
        <p className="section-subtitle">Category-aligned films with support for external embed links.</p>
        <div className="filters-row">
          <CategoryTabs categories={categories} active={activeCategory} onChange={setActiveCategory} allowAll />
          <SearchBox value={search} onChange={setSearch} placeholder="Search event films..." />
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
