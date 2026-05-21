import { useEffect, useState } from "react";
import { ResolvedImage } from "./ResolvedImage";

export function HeroCarousel({ slides }) {
  const safeSlides = (slides || []).filter((slide) => slide && typeof slide.imageUrl === "string" && slide.imageUrl.trim());
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (safeSlides.length <= 1) return undefined;
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % safeSlides.length);
    }, 3000);
    return () => window.clearInterval(id);
  }, [safeSlides.length]);

  if (!safeSlides.length) {
    return (
      <div className="hero-carousel hero-carousel--empty">
        <div className="hero-carousel__overlay" />
        <div className="hero-carousel__content">
          <p className="hero-carousel__eyebrow">Stories by Vamshe</p>
          <h1>Premium Photography for Timeless Celebrations</h1>
          <p>Upload hero slides from Admin - Homepage to activate your dynamic carousel.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="hero-carousel">
      {safeSlides.map((slide, index) => (
        <article
          key={slide.id || `${slide.imageUrl}-${index}`}
          className={`hero-carousel__slide ${active === index ? "is-active" : ""}`}
        >
          <ResolvedImage src={slide.imageUrl} alt={slide.title || "Hero slide"} loading="eager" />
          <div className="hero-carousel__overlay" />
          <div className="hero-carousel__content">
            <p className="hero-carousel__eyebrow">{slide.kicker || "Wedding Photography"}</p>
            <h1>{slide.title || "Captured with elegance"}</h1>
            <p>{slide.subtitle || "Every frame designed to feel cinematic and personal."}</p>
          </div>
        </article>
      ))}

      <div className="hero-carousel__dots">
        {safeSlides.map((slide, index) => (
          <button
            type="button"
            key={slide.id || index}
            className={active === index ? "is-active" : ""}
            onClick={() => setActive(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
