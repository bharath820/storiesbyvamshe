import { useEffect, useMemo, useState } from "react";
import { CategoryTabs } from "../components/filters/CategoryTabs";
import { SearchBox } from "../components/filters/SearchBox";
import { VideoCard } from "../components/media/VideoCard";
import { subscribePublishedCategories, subscribePublishedCollection } from "../lib/firestoreService";

export function VideosPage() {
  const [categories, setCategories] = useState([]);
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    let categoryRows = [];
    let videoRows = [];
    function sync() {
      const catMap = new Map(categoryRows.map((c) => [c.id, c.name]));
      setCategories(categoryRows);
      setVideos([...videoRows].sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || ""))).map((video) => ({
          ...video,
          categoryName: catMap.get(video.categoryId) || "General"
        })));
    }
    const stopCategories = subscribePublishedCategories((rows) => { categoryRows = rows; sync(); });
    const stopVideos = subscribePublishedCollection("videos", (rows) => { videoRows = rows; sync(); });
    return () => {
      stopCategories(); stopVideos();
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
