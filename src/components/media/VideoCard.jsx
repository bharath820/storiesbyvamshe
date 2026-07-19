import { useState } from "react";
import { ResolvedImage } from "./ResolvedImage";

function parseMediaUrl(rawUrl) {
  const trimmedUrl = String(rawUrl || "").trim();
  if (!trimmedUrl) return null;

  try {
    return new URL(trimmedUrl);
  } catch {
    if (/^(www\.)?(youtube\.com|youtu\.be|youtube-nocookie\.com|vimeo\.com|player\.vimeo\.com)\//i.test(trimmedUrl)) {
      return new URL(`https://${trimmedUrl}`);
    }
  }

  return null;
}

function getSafeHttpUrl(rawUrl) {
  const url = parseMediaUrl(rawUrl);
  return url && (url.protocol === "http:" || url.protocol === "https:") ? url.toString() : "";
}

function isYouTubeHost(host) {
  return (
    host === "youtube.com" ||
    host.endsWith(".youtube.com") ||
    host === "youtube-nocookie.com" ||
    host.endsWith(".youtube-nocookie.com")
  );
}

function getYouTubeVideoId(rawUrl) {
  const url = parseMediaUrl(rawUrl);
  if (!url) return "";

  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  const pathParts = url.pathname.split("/").filter(Boolean);

  if (host === "youtu.be") {
    return pathParts[0] || "";
  }

  if (isYouTubeHost(host)) {
    const watchId = url.searchParams.get("v");
    if (watchId) return watchId;

    const videoPathMarkers = new Set(["embed", "shorts", "live"]);
    const markerIndex = pathParts.findIndex((part) => videoPathMarkers.has(part));
    return markerIndex >= 0 ? pathParts[markerIndex + 1] || "" : "";
  }

  return "";
}

function getYouTubeWatchUrl(rawUrl) {
  const videoId = getYouTubeVideoId(rawUrl);
  return videoId ? `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}` : "";
}

export function VideoCard({ video }) {
  const [playing, setPlaying] = useState(!video.thumbnailUrl);
  const isEmbed = video.sourceType === "link";
  const safeMediaUrl = getSafeHttpUrl(video.mediaUrl);
  const youTubeWatchUrl = isEmbed ? getYouTubeWatchUrl(video.mediaUrl) : "";

  return (
    <article className="video-card">
      <div className="video-card__media">
        {youTubeWatchUrl ? (
          <a
            className={`video-card__thumbnail${video.thumbnailUrl ? "" : " video-card__thumbnail--empty"}`}
            href={youTubeWatchUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Play ${video.title} on YouTube`}
          >
            {video.thumbnailUrl && <ResolvedImage src={video.thumbnailUrl} alt="" />}
            <span className="video-card__play-icon" aria-hidden="true" />
          </a>
        ) : isEmbed && !playing ? (
          <button className="video-card__thumbnail" type="button" onClick={() => setPlaying(true)} aria-label={`Play ${video.title}`}>
            <ResolvedImage src={video.thumbnailUrl} alt="" />
            <span className="video-card__play-icon" aria-hidden="true" />
          </button>
        ) : isEmbed ? (
          <iframe src={safeMediaUrl} title={video.title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        ) : (
          <video controls src={video.mediaUrl} poster={video.thumbnailUrl || ""} />
        )}
      </div>
      <div className="video-card__body"><h4>{video.title}</h4><p>{video.categoryName || "Event Film"}</p></div>
    </article>
  );
}
