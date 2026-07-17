import { ResolvedImage } from "./ResolvedImage";

export function PhotoCard({ photo, showCaption = true, className = "" }) {
  const cardClassName = ["photo-card", className].filter(Boolean).join(" ");

  return (
    <article className={cardClassName}>
      <ResolvedImage src={photo.imageUrl} alt={photo.title || `${photo.categoryName || "Gallery"} image`} />
      {showCaption && (
        <div className="photo-card__caption">
          {photo.title && <h4>{photo.title}</h4>}
          <p>{photo.categoryName || "Category"}</p>
        </div>
      )}
    </article>
  );
}
