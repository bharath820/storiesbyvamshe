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
    title: "How to Plan a Perfect Wedding Shoot",
    slug: "how-to-plan-a-perfect-wedding-shoot",
    excerpt: "A practical guide to timeline, light, and portrait planning.",
    body: "Use golden-hour portraits, plan buffer time for rituals, and align outfits with location tones.",
    coverImage:
      "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    publishedAt: "2026-01-22T12:00:00.000Z",
    createdAt: "2026-01-22T12:00:00.000Z"
  },
  {
    id: "blog-2",
    title: "The Magic of Golden Hour Portraits",
    slug: "the-magic-of-golden-hour-portraits",
    excerpt: "Simple ways to use warm evening light for natural, timeless portraits.",
    body: "Golden hour brings soft shadows and warm tones. Choose an open location, arrive early, and keep your subjects moving naturally.",
    coverImage:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80",
    status: "published",
    publishedAt: "2026-02-02T12:00:00.000Z",
    createdAt: "2026-02-02T12:00:00.000Z"
  },
  {
    id: "blog-3",
    title: "Choosing a Storytelling Wedding Venue",
    slug: "choosing-a-storytelling-wedding-venue",
    excerpt: "What to look for in a venue when photographs matter as much as the celebration.",
    body: "Look for varied backdrops, uncluttered preparation rooms, and dependable natural light throughout the day.",
    coverImage:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=80",
    status: "published",
    publishedAt: "2026-02-12T12:00:00.000Z",
    createdAt: "2026-02-12T12:00:00.000Z"
  },
  {
    id: "blog-4",
    title: "A Guide to Candid Couple Photos",
    slug: "a-guide-to-candid-couple-photos",
    excerpt: "Gentle prompts that create honest expressions without stiff posing.",
    body: "Focus on movement, conversation, and small shared moments. The best candid frames happen when couples forget about the camera.",
    coverImage:
      "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=900&q=80",
    status: "published",
    publishedAt: "2026-02-22T12:00:00.000Z",
    createdAt: "2026-02-22T12:00:00.000Z"
  },
  {
    id: "blog-5",
    title: "Details That Complete Your Wedding Story",
    slug: "details-that-complete-your-wedding-story",
    excerpt: "Why invitations, jewellery, flowers, and heirlooms deserve a place in the story.",
    body: "Gather meaningful details before the day begins so they can be photographed calmly and woven naturally into the final gallery.",
    coverImage:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80",
    status: "published",
    publishedAt: "2026-03-04T12:00:00.000Z",
    createdAt: "2026-03-04T12:00:00.000Z"
  },
  {
    id: "blog-6",
    title: "Creating a Stress-Free Photo Timeline",
    slug: "creating-a-stress-free-photo-timeline",
    excerpt: "Build breathing room into the day and enjoy every important moment.",
    body: "Start with ceremony timings, reserve portrait windows around the best light, and include buffers for travel and unexpected delays.",
    coverImage:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=80",
    status: "published",
    publishedAt: "2026-03-14T12:00:00.000Z",
    createdAt: "2026-03-14T12:00:00.000Z"
  },
  {
    id: "blog-7",
    title: "How to Feel Natural in Front of the Camera",
    slug: "how-to-feel-natural-in-front-of-the-camera",
    excerpt: "Practical tips for relaxed expressions and photographs that feel like you.",
    body: "Wear something comfortable, focus on each other, and allow movement between poses. Confidence grows when the session feels playful.",
    coverImage:
      "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=900&q=80",
    status: "published",
    publishedAt: "2026-03-24T12:00:00.000Z",
    createdAt: "2026-03-24T12:00:00.000Z"
  },
  {
    id: "blog-8",
    title: "Preserving Celebrations Through Albums",
    slug: "preserving-celebrations-through-albums",
    excerpt: "Turn digital memories into a handcrafted story your family can revisit.",
    body: "A thoughtful album balances emotional highlights, quiet details, and the people who shaped the celebration from beginning to end.",
    coverImage:
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=80",
    status: "published",
    publishedAt: "2026-04-03T12:00:00.000Z",
    createdAt: "2026-04-03T12:00:00.000Z"
  }
];
