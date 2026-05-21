import { useEffect, useMemo, useState } from "react";
import { getPublishedPhotos } from "../lib/firestoreService";
import { resolveAssetUrl } from "../lib/assetUrlService";
import { subscribeToContentChanges } from "../lib/localDataStore";

const ABOUT_FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1400&q=80"
];

const RECORDS = [
  { value: "25+", label: "Years of Experience" },
  { value: "4500+", label: "Weddings" },
  { value: "1200+", label: "Celebrity Shoots" },
  { value: "200+", label: "Workshops" }
];

function createImagePool(photos) {
  const seen = new Set();
  const all = [...(photos || []).map((photo) => photo.imageUrl), ...ABOUT_FALLBACK_IMAGES];
  const unique = [];

  all.forEach((url) => {
    if (!url || seen.has(url)) return;
    seen.add(url);
    unique.push(url);
  });

  return unique;
}

export function AboutPage() {
  const [photos, setPhotos] = useState([]);
  const [resolvedPool, setResolvedPool] = useState([]);

  useEffect(() => {
    let isActive = true;

    async function load() {
      const rows = await getPublishedPhotos();
      if (!isActive) return;
      setPhotos(rows);
    }

    load().catch(() => {
      if (isActive) setPhotos([]);
    });

    const unsubscribe = subscribeToContentChanges(() => {
      load().catch(() => {});
    });

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, []);

  const imagePool = useMemo(() => createImagePool(photos), [photos]);

  useEffect(() => {
    let isActive = true;

    async function resolvePool() {
      const next = await Promise.all(
        imagePool.map(async (url) => {
          try {
            return await resolveAssetUrl(url);
          } catch {
            return "";
          }
        })
      );

      if (!isActive) {
        next.forEach((url) => {
          if (url && url.startsWith("blob:")) {
            window.URL.revokeObjectURL(url);
          }
        });
        return;
      }

      setResolvedPool((prev) => {
        prev.forEach((url) => {
          if (url && url.startsWith("blob:")) {
            window.URL.revokeObjectURL(url);
          }
        });
        return next.filter(Boolean);
      });
    }

    resolvePool().catch(() => {
      if (isActive) {
        setResolvedPool([]);
      }
    });

    return () => {
      isActive = false;
    };
  }, [imagePool]);

  const primaryImage = resolvedPool[0] || imagePool[0];
  const recordsBackground = resolvedPool[1] || resolvedPool[0] || imagePool[1] || imagePool[0];
  const collageImages = [
    resolvedPool[2] || resolvedPool[0] || imagePool[2] || imagePool[0],
    resolvedPool[3] || resolvedPool[1] || resolvedPool[0] || imagePool[3] || imagePool[1] || imagePool[0],
    resolvedPool[4] || resolvedPool[2] || resolvedPool[0] || imagePool[4] || imagePool[2] || imagePool[0],
    resolvedPool[5] || resolvedPool[3] || resolvedPool[0] || imagePool[5] || imagePool[3] || imagePool[0],
    resolvedPool[6] || resolvedPool[4] || resolvedPool[0] || imagePool[6] || imagePool[4] || imagePool[0],
    resolvedPool[7] || resolvedPool[5] || resolvedPool[0] || imagePool[7] || imagePool[5] || imagePool[0]
  ];

  return (
    <>
      <section className="about-story section">
        <div className="about-story__split">
          <div className="about-story__media">
            <img src={primaryImage} alt="Lead photographer capturing a wedding moment" loading="lazy" />
          </div>
          <div className="about-story__content">
            <div className="about-story__content-inner">
              <p className="about-story__eyebrow">About Us</p>
              <h1 className="about-story__title">Stories by Vamshe</h1>
              <p>
                At every wedding, every moment is precious, and we believe photography is the most powerful
                way to preserve those moments for a lifetime. We are a team of passionate and skilled
                photographers who go beyond just taking pictures, creating stories filled with emotion,
                warmth, and timeless memories.
              </p>
              <p>
                With <strong>25 years of experience and over 4500 weddings</strong> captured across India and
                worldwide, our studio has built a reputation for delivering unique, creative, and heartfelt
                wedding stories.
              </p>
              <p>
                We believe in <strong>authentic storytelling</strong>, not forced poses. Our style focuses on
                moments as they naturally unfold, combining light, mood, texture, and relationships to
                create images that genuinely reflect your story.
              </p>
              <p>
                While trends evolve, our focus remains unchanged: <strong>to capture your love story and
                emotions in their truest form</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-records" style={{ backgroundImage: `url("${recordsBackground}")` }}>
        <div className="about-records__overlay" />
        <div className="container about-records__inner">
          <h2 className="about-records__title">Our Records</h2>
          <div className="about-records__grid">
            {RECORDS.map((record) => (
              <article key={record.label} className="about-records__card">
                <p className="about-records__value">{record.value}</p>
                <p className="about-records__label">{record.label}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-collage section">
        <div className="container">
          <div className="about-collage__intro">
            <h2>So Much of Brilliance Around Us</h2>
            <p>A bit from our end to spread that all over, one frame at a time.</p>
          </div>
          <div className="about-collage__grid">
            {collageImages.map((image, index) => (
              <figure key={`${image}-${index}`} className={`about-collage__tile about-collage__tile--${index + 1}`}>
                <img src={image} alt={`Behind the scenes storytelling frame ${index + 1}`} loading="lazy" />
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
