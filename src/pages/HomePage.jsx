import { useEffect, useState } from "react";
import { HeroCarousel } from "../components/media/HeroCarousel";
import { ResolvedImage } from "../components/media/ResolvedImage";
import { getHomepageConfig } from "../lib/firestoreService";
import { subscribeToContentChanges } from "../lib/localDataStore";

export function HomePage() {
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState({ heroSlides: [], contentImages: [] });

  useEffect(() => {
    let isActive = true;

    async function load(showInitialLoader = false) {
      if (showInitialLoader) {
        setLoading(true);
      }
      const homepageConfig = await getHomepageConfig();
      if (!isActive) return;
      setConfig(homepageConfig);
      if (showInitialLoader) {
        setLoading(false);
      }
    }

    load(true).catch(() => {
      if (isActive) setLoading(false);
    });

    const unsubscribe = subscribeToContentChanges(() => {
      load(false).catch(() => {});
    });

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, []);

  const contentImages = (config?.contentImages || []).filter((image) => image?.imageUrl);

  return (
    <>
      <HeroCarousel slides={config?.heroSlides || []} />

      <section className="home-content-gallery">
        {loading ? (
          <div className="container">
            <p className="home-content-gallery__status">Loading images...</p>
          </div>
        ) : !contentImages.length ? (
          <div className="container">
            <p className="home-content-gallery__status">Homepage content images will appear here soon.</p>
          </div>
        ) : (
          <div className="home-content-gallery__grid">
            {contentImages.map((image, index) => (
              <article key={image.id || image.imageUrl} className="home-content-gallery__card">
                <ResolvedImage src={image.imageUrl} alt={`Homepage content ${index + 1}`} />
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
