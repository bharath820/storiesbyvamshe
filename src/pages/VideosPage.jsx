import { useEffect, useState } from "react";
import { VideoCard } from "../components/media/VideoCard";
import { subscribePublishedCollection } from "../lib/firestoreService";

export function VideosPage() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    return subscribePublishedCollection("videos", (rows) => {
      setVideos(
        [...rows].sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))
      );
    });
  }, []);

  return (
    <section className="section videos-page">
      <div className="container">
        <div className="video-grid">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
        {!videos.length && (
          <p className="empty-state">No videos have been published yet.</p>
        )}
      </div>
    </section>
  );
}
