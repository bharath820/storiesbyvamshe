import { useEffect, useState } from "react";
import { subscribeCollection } from "../../lib/firestoreService";

const DASHBOARD_COLLECTIONS = ["categories", "photos", "videos", "blogs"];

export function AdminDashboardPage() {
  const [stats, setStats] = useState({
    categories: 0,
    photos: 0,
    videos: 0,
    blogs: 0
  });

  useEffect(() => {
    const stops = DASHBOARD_COLLECTIONS.map((name) => subscribeCollection(name, (rows) => {
      setStats((current) => ({ ...current, [name]: rows.length }));
    }));
    return () => stops.forEach((stop) => stop());
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
