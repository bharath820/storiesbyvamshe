export function VideoCard({ video }) {
  const isEmbed = video.sourceType === "link";

  return (
    <article className="video-card">
      <div className="video-card__media">
        {isEmbed ? (
          <iframe
            src={video.mediaUrl}
            title={video.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video controls src={video.mediaUrl} poster={video.thumbnailUrl || ""} />
        )}
      </div>
      <div className="video-card__body">
        <h4>{video.title}</h4>
        <p>{video.categoryName || "Event Film"}</p>
      </div>
    </article>
  );
}

