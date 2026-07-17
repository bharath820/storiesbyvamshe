export type HomepageMedia = {
  id?: string;
  imageUrl: string;
  storagePath?: string;
  title?: string;
  subtitle?: string;
  kicker?: string;
};

export type HomepageConfig = {
  heroSlides?: HomepageMedia[];
  contentImages?: HomepageMedia[];
};

export function subscribeHomepageConfig(
  callback: (config: HomepageConfig) => void,
  onError?: (error: Error) => void
): () => void;

