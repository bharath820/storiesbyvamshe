import { useEffect, useMemo, useState } from "react";
import { subscribePublishedCollection } from "../lib/firestoreService";
import { resolveAssetUrl } from "../lib/assetUrlService";

const ABOUT_STORY_IMAGE = "/assets/about/about-story-holi-child.jpeg";

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
  { value: "12+", label: "Years of Experience" },
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
    return subscribePublishedCollection("photos", setPhotos, () => setPhotos([]));
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
        return;
      }

      setResolvedPool((prev) => {
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

  const primaryImage = ABOUT_STORY_IMAGE;
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
            <img src={primaryImage} alt="Child smiling during a colorful celebration" loading="lazy" />
          </div>
          <div className="about-story__content">
            <div className="about-story__content-inner">
              <p className="about-story__eyebrow">About Us</p>
              <h1 className="about-story__title">Stories by Vamshe</h1>
              <p>
                At <strong>Storiesbyvamshe</strong>, we believe every moment has a story worth remembering.
                With <strong>12+ years of experience</strong> in photography, our team of talented and
                passionate professionals is dedicated to capturing genuine emotions and timeless memories.
              </p>
              <p>
                We specialize in <strong>wedding photography, candid moments, and cinematic films</strong>,
                creating beautiful visuals that reflect your unique story. Our approach is simple: we focus
                on natural moments, attention to detail, and delivering photographs and films you'll cherish
                for a lifetime.
              </p>
              <p>
                Whether it's an intimate ceremony or a grand celebration, we are committed to providing a
                professional, comfortable, and memorable experience from start to finish.
              </p>
              <p>
                <strong>Storiesbyvamshe - Capturing Moments. Creating Memories.</strong>
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
