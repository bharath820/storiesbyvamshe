import { useEffect, useState } from "react";
import { listCollection } from "../../lib/firestoreService";
import { subscribeToContentChanges } from "../../lib/localDataStore";

export function AdminDashboardPage() {
  const [stats, setStats] = useState({
    categories: 0,
    photos: 0,
    videos: 0,
    blogs: 0
  });

  useEffect(() => {
    let isActive = true;

    async function load() {
      const [categories, photos, videos, blogs] = await Promise.all([
        listCollection("categories"),
        listCollection("photos"),
        listCollection("videos"),
        listCollection("blogs")
      ]);
      if (!isActive) return;
      setStats({
        categories: categories.length,
        photos: photos.length,
        videos: videos.length,
        blogs: blogs.length
      });
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

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Manage homepage assets, categories, photos, videos, and blogs.</p>
      <div className="admin-stats">
        <article>
          <h3>{stats.categories}</h3>
          <p>Categories</p>
        </article>
        <article>
          <h3>{stats.photos}</h3>
          <p>Photos</p>
        </article>
        <article>
          <h3>{stats.videos}</h3>
          <p>Videos</p>
        </article>
        <article>
          <h3>{stats.blogs}</h3>
          <p>Blogs</p>
        </article>
      </div>
    </div>
  );
}
