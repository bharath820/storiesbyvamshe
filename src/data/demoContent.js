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
      imageUrl:
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=80",
      title: "Elegant Wedding Stories",
      subtitle: "Premium photography and films designed to feel timeless.",
      kicker: "Wedding Photography"
    },
    {
      id: "hero-2",
      imageUrl:
        "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1800&q=80",
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
    title: "Portrait Light",
    categoryId: categoryIdFor("portraits"),
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
    title: "How to Plan a Perfect Wedding Shoot",
    slug: "how-to-plan-a-perfect-wedding-shoot",
    excerpt: "A practical guide to timeline, light, and portrait planning.",
    body: "Use golden-hour portraits, plan buffer time for rituals, and align outfits with location tones.",
    coverImage:
      "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    publishedAt: "2026-01-22T12:00:00.000Z",
    createdAt: "2026-01-22T12:00:00.000Z"
  }
];
