import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ResolvedImage } from '../components/media/ResolvedImage';
import { categories, featuredStories, hero, instagram, stats, testimonials } from '../data/homeContent';
import type { Category } from '../types/home';
import { subscribeHomepageConfig } from '../lib/firestoreService';
import { OFFICIAL_INSTAGRAM_HANDLE, OFFICIAL_INSTAGRAM_URL } from '../lib/socialLinks';

type HomepageMedia = {
  id?: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  kicker?: string;
};

const reveal = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0 }
};

const categoryIcon: Record<string, string> = {
  Wedding: 'M12 21c-4.97-2.9-8-6.05-8-9.46C4 8.8 6.2 7 8.9 7c1.6 0 2.82.7 3.6 1.85C13.28 7.7 14.5 7 16.1 7 18.8 7 21 8.8 21 11.54c0 3.41-3.03 6.56-8 9.46z',
  'Pre-Wedding': 'M4 19l4-4m0 0 5-5 4 4-5 5m-4-4 4 4m7-11a2 2 0 1 1-4 0 2 2 0 0 1 4 0z',
  Engagement: 'M7 14a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm10 8a5 5 0 1 1 0-10 5 5 0 0 1 0 10z',
  Sangeeth: 'M9 18V5l11-2v13M9 18a3 3 0 1 1-3-3 3 3 0 0 1 3 3zm11-2a3 3 0 1 1-3-3 3 3 0 0 1 3 3z',
  Haldhi: 'M12 3v3m0 12v3M5.64 5.64l2.12 2.12m8.48 8.48 2.12 2.12M3 12h3m12 0h3M5.64 18.36l2.12-2.12m8.48-8.48 2.12-2.12M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z',
  Reception: 'M8 3h8l-1 8a3 3 0 0 1-6 0L8 3zm4 11v7m-4 0h8',
  'Baby Shoot': 'M12 6a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 7c3.3 0 6 2.02 6 4.5V19H6v-1.5C6 15.02 8.7 13 12 13z',
  Maternity: 'M12 4v16m-6-8h12',
  Birthday: 'M8 10h8v10H8zM10 7h4v3h-4zM5 20h14',
  Portraits: 'M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-4 0-7 2.2-7 5v1h14v-1c0-2.8-3-5-7-5z'
};

function Icon({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={categoryIcon[name]} />
    </svg>
  );
}

function getGalleryCategoryPath(category: Category) {
  const categoryParam = category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return `/gallery?category=${encodeURIComponent(categoryParam)}`;
}

function getGlimpseCardClass(index: number, total: number) {
  const tabletSpan = total % 2 === 1 && index === total - 1 ? 'sm:col-span-2' : 'sm:col-span-1';
  let desktopSpan = 'lg:col-span-4';

  if (total === 1) {
    desktopSpan = 'lg:col-span-12';
  } else if (total === 2) {
    desktopSpan = 'lg:col-span-6';
  } else if (total % 3 === 1) {
    desktopSpan = index < 2 || index >= total - 2 ? 'lg:col-span-6' : 'lg:col-span-4';
  } else if (total % 3 === 2) {
    desktopSpan = index >= total - 2 ? 'lg:col-span-6' : 'lg:col-span-4';
  }

  return `${tabletSpan} ${desktopSpan}`;
}

export function HomePage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [slide, setSlide] = useState(0);
  const [heroIndex, setHeroIndex] = useState(0);
  const [homepageMedia, setHomepageMedia] = useState<{ heroSlides: HomepageMedia[]; contentImages: HomepageMedia[] }>({
    heroSlides: [],
    contentImages: []
  });

  useEffect(() => {
    const id = window.setInterval(() => {
      setSlide((prev) => (prev + 1) % testimonials.length);
    }, 3800);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => subscribeHomepageConfig((config: { heroSlides?: HomepageMedia[]; contentImages?: HomepageMedia[] }) => {
    setHomepageMedia({ heroSlides: config.heroSlides || [], contentImages: config.contentImages || [] });
    setHeroIndex(0);
  }), []);

  useEffect(() => {
    if (homepageMedia.heroSlides.length < 2) return undefined;
    const id = window.setInterval(() => setHeroIndex((index) => (index + 1) % homepageMedia.heroSlides.length), 5000);
    return () => window.clearInterval(id);
  }, [homepageMedia.heroSlides.length]);

  const filteredStories = useMemo(
    () => featuredStories.filter((item) => activeCategory === 'All' || item.category === activeCategory),
    [activeCategory]
  );

  const visibleTestimonials = [
    testimonials[slide % testimonials.length],
    testimonials[(slide + 1) % testimonials.length],
    testimonials[(slide + 2) % testimonials.length]
  ];
  const activeHero = homepageMedia.heroSlides[heroIndex];
  const dynamicStories = homepageMedia.contentImages.filter((item) => item.imageUrl);
  const homepageStories = dynamicStories.length
    ? dynamicStories.map((item, index) => ({
        id: item.id || `homepage-${index}`,
        image: item.imageUrl,
        alt: `Homepage gallery image ${index + 1}`,
        size: 'regular',
        category: ''
      }))
    : filteredStories;

  return (
    <div className="bg-brandBg">
      <section className="section-shell grid min-h-[96svh] items-center gap-10 overflow-hidden py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
        <motion.div className="min-w-0" initial="hidden" whileInView="show" viewport={{ once: true }} variants={reveal} transition={{ duration: 0.8 }}>
          <p className="gold-kicker mb-6">{activeHero?.kicker || 'CAPTURING MOMENTS'}</p>
          <h1 className="font-display text-5xl leading-[0.98] text-brandText sm:text-6xl lg:text-7xl">
            {activeHero?.title || <>Creating Memories<br />That Last Forever</>}
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-brandSubtext sm:text-base">
            {activeHero?.subtitle || <>Weddings • Pre-Weddings • Baby Shoots<br />Maternity • Events • Cinematic Films</>}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/about" className="rounded-full bg-brandText px-7 py-3 text-sm text-white transition hover:-translate-y-0.5 hover:bg-black">View Portfolio</Link>
            <Link to="/videos" className="rounded-full border border-brandBorder bg-white px-7 py-3 text-sm transition hover:-translate-y-0.5 hover:border-brandText">Watch Showreel</Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="relative min-w-0 overflow-hidden rounded-[32px] bg-[#F8F4EE] shadow-soft"
        >
          <ResolvedImage
            src={activeHero?.imageUrl || hero.image}
            alt={activeHero?.title || hero.alt}
            className="mx-auto h-[58svh] min-h-[360px] max-h-[680px] w-full object-contain sm:h-[68svh] lg:h-[76svh]"
            loading="eager"
            fallbackSrc={hero.image}
          />
          <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-gradient-to-t from-black/10 to-transparent" />
        </motion.div>
      </section>

      <section className="bg-[#FAF7F2] py-8">
        <div className="section-shell">
          <div className="mb-6 flex items-center justify-between gap-3">
            <h2 className="font-display text-3xl sm:text-4xl">Curated Categories</h2>
            <button onClick={() => setActiveCategory('All')} className="text-xs uppercase tracking-[0.2em] text-brandSubtext hover:text-brandText">Show All</button>
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:gap-3 md:overflow-visible">
            {categories.filter((c) => c !== 'All').map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => {
                  setActiveCategory(category);
                  navigate(getGalleryCategoryPath(category));
                }}
                className={`group min-w-[165px] rounded-2xl border px-4 py-4 text-left transition ${
                  activeCategory === category
                    ? 'border-black bg-black text-white'
                    : 'border-brandBorder bg-white text-brandText hover:border-brandGold hover:bg-brandSoft'
                }`}
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/5 group-hover:bg-black/10">
                  <Icon name={category} />
                </div>
                    <p className="text-sm font-medium">{category}</p>
                </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-14">
        <motion.h2 initial="hidden" whileInView="show" viewport={{ once: true }} variants={reveal} transition={{ duration: 0.6 }} className="font-display text-4xl sm:text-5xl">A Glimpse Of Our Work</motion.h2>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-12">
          {homepageStories.map((story, index) => (
            <motion.article key={story.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`group relative overflow-hidden rounded-3xl ${getGlimpseCardClass(index, homepageStories.length)}`}>
              <ResolvedImage src={story.image} alt={story.alt} className="h-[21rem] w-full object-cover transition duration-700 group-hover:scale-[1.06] sm:h-[23rem] lg:h-[24rem]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
              {story.category && <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs text-black">{story.category}</span>}
              <button className="absolute bottom-5 left-5 rounded-full border border-white/70 bg-white/10 px-4 py-2 text-xs text-white opacity-0 backdrop-blur transition group-hover:opacity-100">View Story</button>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="border-y border-brandBorder bg-[#F8F4EE] py-10">
        <div className="section-shell grid gap-7 text-center sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label}>
              <p className="font-display text-4xl text-brandText">{item.value}</p>
              <p className="mt-2 text-sm text-brandSubtext">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell py-14">
        <div className="grid gap-6 rounded-[20px] bg-white p-5 shadow-[0_12px_36px_rgba(30,30,30,0.08)] lg:grid-cols-[1.2fr_1fr_0.9fr] lg:items-center lg:p-6">
          <img
            src="/assets/home/about-vamshe.jpg"
            alt="Vamshe with camera portrait"
            className="h-[260px] w-full rounded-xl object-cover object-center md:h-[320px] lg:h-[280px]"
          />

          <div className="lg:px-2">
            <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-brandSubtext">About Me</p>
            <h3 className="font-display text-4xl">Meet Vamshe</h3>
            <p className="mt-4 max-w-md text-sm leading-7 text-brandSubtext">
              I'm a passionate photographer and filmmaker who believes in capturing real emotions and timeless moments.
              With years of experience in all types of events, I turn your moments into beautiful memories.
            </p>
            <button className="mt-5 rounded-md bg-[#121212] px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-white transition hover:bg-black">
              Know More About Me
            </button>
          </div>

          <div className="grid gap-3 border-brandBorder pt-2 text-sm text-brandText lg:border-l lg:pl-6">
            <p>✧ Creative Vision</p>
            <p>✧ Timeless Memories</p>
            <p>✧ Cinematic Quality</p>
            <p>✧ Client Satisfaction</p>
            <p className="pt-2 font-display text-2xl text-brandGold">My Promise</p>
          </div>
        </div>
      </section>

      <section className="bg-[#FAF7F2] py-14">
        <div className="section-shell">
          <h3 className="font-display text-4xl">Client Stories</h3>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {visibleTestimonials.map((item) => (
              <motion.article key={item.id + slide} layout className="rounded-3xl border border-brandBorder bg-white p-6 shadow-[0_10px_32px_rgba(30,30,30,0.06)]">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="h-14 w-14 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-brandSubtext">{item.eventType}</p>
                    <p className="text-xs tracking-widest text-brandGold">★★★★★</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-brandText">{item.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-14">
        <h3 className="font-display text-4xl">Follow Our Journey</h3>
        <p className="mt-2 text-sm text-brandSubtext">{OFFICIAL_INSTAGRAM_HANDLE}</p>
        <div className="journey-strip mt-6" aria-label="Recent Stories by Vamshe photographs">
          <div className="journey-strip__track">
            {[false, true].map((isDuplicate) => (
              <div
                key={isDuplicate ? 'duplicate' : 'original'}
                className="journey-strip__set"
                aria-hidden={isDuplicate ? 'true' : undefined}
              >
                {instagram.map((item) => (
                  <img
                    key={`${item.id}-${isDuplicate ? 'duplicate' : 'original'}`}
                    src={item.image}
                    alt={isDuplicate ? '' : item.alt}
                    loading="lazy"
                    className="h-48 w-40 shrink-0 rounded-2xl object-cover transition duration-500 hover:scale-[1.04] sm:h-56 sm:w-48"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        <a
          href={OFFICIAL_INSTAGRAM_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-block rounded-full border border-brandText px-6 py-3 text-sm hover:bg-brandText hover:text-white"
        >
          Follow On Instagram
        </a>
      </section>

      <section className="section-shell pb-16">
        <div className="grid items-center gap-7 rounded-[34px] bg-[#F8F4EE] p-8 md:grid-cols-2 md:p-11">
          <div>
            <h3 className="font-display text-4xl leading-tight">Every Story Deserves<br />To Be Remembered.<br />Let's Create Yours.</h3>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/contact" className="rounded-full bg-brandText px-6 py-3 text-sm text-white">Book A Session</Link>
              <Link to="/contact" className="rounded-full border border-brandBorder bg-white px-6 py-3 text-sm">Contact Us</Link>
            </div>
          </div>
          <img src="/assets/home/cta-wedding (2).jpg" alt="Reception couple portrait with warm cinematic tones" className="h-[21rem] w-full rounded-[26px] object-cover" />
        </div>
      </section>
    </div>
  );
}

