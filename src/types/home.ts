export type Category =
  | 'All'
  | 'Engagement'
  | 'Pre-Wedding'
  | 'Sangeeth'
  | 'Haldhi'
  | 'Wedding'
  | 'Reception'
  | 'Birthday'
  | 'Baby Shoot'
  | 'Maternity';

export interface HomeHero {
  image: string;
  alt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: Exclude<Category, 'All'>;
  image: string;
  alt: string;
  size: 'tall' | 'wide' | 'square';
}

export interface StatItem {
  value: string;
  label: string;
}

export interface Testimonial {
  id: string;
  name: string;
  eventType: string;
  text: string;
  image: string;
}

export interface InstagramItem {
  id: string;
  image: string;
  alt: string;
}

