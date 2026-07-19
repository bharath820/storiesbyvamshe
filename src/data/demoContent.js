import { defaultCategories } from "./defaultCategories";

const demoCategoryIds = Object.fromEntries(defaultCategories.map((item) => [item.slug, item.slug]));

function categoryIdFor(slug) {
  const id = demoCategoryIds[slug];
  if (!id) {
    throw new Error(`Demo content category mapping missing for slug: ${slug}`);
  }
  return id;
}

export const demoCategories = defaultCategories.map((item) => ({
  ...item,
  id: item.slug
}));

export const demoHomepageConfig = {
  heroSlides: [
    {
      id: "hero-1",
      imageUrl: "/assets/home/IMG_7216.JPG.jpeg",
      title: "Creating Memories That Last Forever",
      subtitle: "Weddings, pre-weddings, baby shoots, maternity, events, and cinematic films.",
      kicker: "Capturing Moments"
    },
    {
      id: "hero-2",
      imageUrl: "/assets/home/wedding-1.jpeg",
      title: "Candid Emotion, Cinematic Frames",
      subtitle: "Every celebration captured with detail, color, and soul.",
      kicker: "Signature Events"
    }
  ],
  featuredCards: [],
  contentImages: [],
  introBlocks: [
    {
      title: "Emotion First",
      text: "We capture real moments and meaningful details with an editorial finish."
    },
    {
      title: "Premium Color Story",
      text: "Balanced tones and natural light make every frame look rich and timeless."
    },
    {
      title: "Full Event Coverage",
      text: "From rituals and portraits to films, every chapter is covered end-to-end."
    }
  ]
};

export const demoPhotos = [
  {
    id: "photo-1",
    title: "Bride Portrait",
    categoryId: categoryIdFor("wedding"),
    imageUrl:
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=900&q=80",
    status: "published",
    createdAt: "2026-01-04T12:00:00.000Z"
  },
  {
    id: "photo-2",
    title: "Couple Walk",
    categoryId: categoryIdFor("pre-wedding"),
    imageUrl:
      "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=900&q=80",
    status: "published",
    createdAt: "2026-01-06T12:00:00.000Z"
  },
  {
    id: "photo-3",
    title: "Ring Ceremony",
    categoryId: categoryIdFor("engagement"),
    imageUrl:
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=80",
    status: "published",
    createdAt: "2026-01-08T12:00:00.000Z"
  },
  {
    id: "photo-4",
    title: "Birthday Joy",
    categoryId: categoryIdFor("birthday"),
    imageUrl:
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=900&q=80",
    status: "published",
    createdAt: "2026-01-10T12:00:00.000Z"
  },
  {
    id: "photo-5",
    title: "Motherhood Story",
    categoryId: categoryIdFor("maternity"),
    imageUrl:
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=900&q=80",
    status: "published",
    createdAt: "2026-01-12T12:00:00.000Z"
  },
  {
    id: "photo-6",
    title: "Baby Smile",
    categoryId: categoryIdFor("baby-shoot"),
    imageUrl:
      "https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=900&q=80",
    status: "published",
    createdAt: "2026-01-14T12:00:00.000Z"
  },
  {
    id: "photo-7",
    title: "Corporate Launch",
    categoryId: categoryIdFor("corporate-event"),
    imageUrl:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80",
    status: "published",
    createdAt: "2026-01-16T12:00:00.000Z"
  },
  {
    id: "photo-8",
    title: "Haldhi Ceremony",
    categoryId: categoryIdFor("haldhi"),
    imageUrl:
      "https://images.unsplash.com/photo-1506863530036-1efeddceb993?auto=format&fit=crop&w=900&q=80",
    status: "published",
    createdAt: "2026-01-18T12:00:00.000Z"
  }
];

export const demoVideos = [
  {
    id: "video-1",
    title: "Wedding Highlights",
    categoryId: categoryIdFor("wedding"),
    sourceType: "link",
    mediaUrl: "https://www.youtube.com/embed/oUFJJNQGwhk",
    status: "published",
    createdAt: "2026-01-20T12:00:00.000Z"
  }
];

export const demoBlogs = [
  {
    id: "blog-1",
    title: "Planning a Wedding Day Photo Timeline That Feels Calm",
    slug: "planning-a-wedding-day-photo-timeline-that-feels-calm",
    excerpt: "A practical timeline guide for portraits, rituals, family photos, and golden-hour moments.",
    body: "The best wedding photographs usually come from a day that has enough breathing room. We begin with the ceremony timings, add realistic travel buffers, and reserve a separate window for couple portraits so the couple is not rushed between rituals.\n\nFor Indian weddings, small delays are natural, so we also plan flexible pockets around getting-ready portraits, family group photos, and detail shots. This keeps the coverage relaxed while still protecting the emotional moments that matter most.",
    coverImage: "/assets/home/wedding-1.jpeg",
    status: "published",
    publishedAt: "2026-06-28T12:00:00.000Z",
    createdAt: "2026-06-28T12:00:00.000Z"
  },
  {
    id: "blog-2",
    title: "What Makes Pre-Wedding Photos Look Personal",
    slug: "what-makes-pre-wedding-photos-look-personal",
    excerpt: "How location, wardrobe, movement, and small shared habits turn a shoot into a story.",
    body: "A pre-wedding session works best when it feels connected to the couple. Instead of choosing a location only because it looks grand, we look for places that match their pace, style, and comfort.\n\nSoft movement, familiar conversations, and outfits that feel natural on camera help the couple settle in quickly. The result is a gallery that feels designed, but still honest.",
    coverImage: "/assets/home/prewedding-1.jpeg",
    status: "published",
    publishedAt: "2026-06-20T12:00:00.000Z",
    createdAt: "2026-06-20T12:00:00.000Z"
  },
  {
    id: "blog-3",
    title: "How We Capture Haldi Without Losing the Energy",
    slug: "how-we-capture-haldi-without-losing-the-energy",
    excerpt: "Color, movement, laughter, and close family moments are the heart of a memorable Haldi story.",
    body: "Haldi is fast, colorful, and wonderfully unpredictable. We plan wide frames for the celebration, close frames for emotion, and quick detail shots of turmeric, flowers, decor, and family interactions.\n\nThe key is staying close enough to feel the energy while still giving everyone space to enjoy the ritual naturally.",
    coverImage: "/assets/home/haldhi.JPG",
    status: "published",
    publishedAt: "2026-06-12T12:00:00.000Z",
    createdAt: "2026-06-12T12:00:00.000Z"
  },
  {
    id: "blog-4",
    title: "Engagement Photography: Details Worth Slowing Down For",
    slug: "engagement-photography-details-worth-slowing-down-for",
    excerpt: "Rings, outfits, family blessings, decor corners, and couple portraits all shape the final album.",
    body: "An engagement ceremony has a quieter elegance compared with the wedding day, which makes it perfect for thoughtful portraits and detail-driven storytelling.\n\nWe focus on the ring exchange, family blessings, stage decor, and candid reactions between formal moments. These frames often become the emotional bridge between the proposal and the wedding celebration.",
    coverImage: "/assets/home/engagement-1.jpg",
    status: "published",
    publishedAt: "2026-06-04T12:00:00.000Z",
    createdAt: "2026-06-04T12:00:00.000Z"
  },
  {
    id: "blog-5",
    title: "Baby Shoot Prep for Soft, Natural Photographs",
    slug: "baby-shoot-prep-for-soft-natural-photographs",
    excerpt: "Simple preparation tips for comfortable baby portraits with clean light and gentle styling.",
    body: "Baby sessions need patience more than anything else. A warm room, soft fabrics, a familiar toy, and enough time for feeding breaks can make the shoot smoother for both the baby and the parents.\n\nWe keep the styling simple so expressions, tiny details, and family warmth stay at the center of the gallery.",
    coverImage: "/assets/home/baby-1.jpg",
    status: "published",
    publishedAt: "2026-05-27T12:00:00.000Z",
    createdAt: "2026-05-27T12:00:00.000Z"
  },
  {
    id: "blog-6",
    title: "Birthday Event Coverage That Feels Full of Life",
    slug: "birthday-event-coverage-that-feels-full-of-life",
    excerpt: "From decor details to cake moments, birthday stories need timing, patience, and energy.",
    body: "Birthday celebrations move quickly, especially when children are involved. We photograph the decor before guests arrive, then shift attention to candid expressions, games, cake-cutting, family portraits, and tiny in-between moments.\n\nThe goal is a cheerful gallery that parents can revisit years later and still feel the noise, laughter, and excitement of the day.",
    coverImage: "/assets/home/birthday-1.jpg",
    status: "published",
    publishedAt: "2026-05-19T12:00:00.000Z",
    createdAt: "2026-05-19T12:00:00.000Z"
  },
  {
    id: "blog-7",
    title: "Why Candid Wedding Frames Feel Timeless",
    slug: "why-candid-wedding-frames-feel-timeless",
    excerpt: "The quiet reactions, glances, hugs, and laughter often become the most loved wedding memories.",
    body: "Candid wedding photography is not just about clicking random moments. It is about anticipating emotion before it peaks, noticing the people closest to the couple, and understanding the rhythm of each ritual.\n\nWhen we give space to real reactions, the final story feels less staged and more connected to the people who lived it.",
    coverImage: "/assets/home/IMG_6565.JPG.jpeg",
    status: "published",
    publishedAt: "2026-05-11T12:00:00.000Z",
    createdAt: "2026-05-11T12:00:00.000Z"
  },
  {
    id: "blog-8",
    title: "Choosing Outfits That Photograph Beautifully",
    slug: "choosing-outfits-that-photograph-beautifully",
    excerpt: "A simple guide to color, texture, comfort, and coordination for couple and family sessions.",
    body: "Clothes photograph best when they suit the person wearing them. We recommend coordinated colors instead of identical outfits, clean textures instead of busy prints, and silhouettes that allow easy movement.\n\nFor outdoor sessions, we also consider the location palette. Softer tones work beautifully in natural light, while richer colors can make festive portraits feel more polished.",
    coverImage: "/assets/home/insta-1.jpeg",
    status: "published",
    publishedAt: "2026-05-03T12:00:00.000Z",
    createdAt: "2026-05-03T12:00:00.000Z"
  },
  {
    id: "blog-9",
    title: "Turning Event Photos Into a Cohesive Album",
    slug: "turning-event-photos-into-a-cohesive-album",
    excerpt: "How we select hero frames, emotional sequences, and quiet details for a complete final story.",
    body: "A strong album is more than a collection of beautiful images. It needs rhythm: a beginning, emotional highlights, family moments, decor details, portraits, and a closing frame that feels complete.\n\nDuring curation, we balance wide scenes with close emotions and make sure the people, colors, and important rituals flow naturally from one spread to the next.",
    coverImage: "/assets/home/wedding-2.jpg",
    status: "published",
    publishedAt: "2026-04-25T12:00:00.000Z",
    createdAt: "2026-04-25T12:00:00.000Z"
  }
];
