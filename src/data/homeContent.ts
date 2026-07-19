import { GalleryItem, HomeHero, InstagramItem, StatItem, Testimonial } from '../types/home';

export const categories = [
  'All',
  'Engagement',
  'Pre-Wedding',
  'Sangeeth',
  'Haldhi',
  'Wedding',
  'Reception',
  'Birthday',
  'Baby Shoot'
] as const;

export const hero: HomeHero = {
  image: '/assets/home/IMG_7216.JPG.jpeg',
  alt: 'Bride seen in a mirror while the groom waits in warm cinematic light'
};

export const featuredStories: GalleryItem[] = [
  { id: 'e-1', title: 'Ring Story', category: 'Engagement', image: '/assets/home/engagement-1.jpg', alt: 'Engagement couple silhouettes holding rings', size: 'tall' },
  { id: 'pw-1', title: 'Golden Hour Promise', category: 'Pre-Wedding', image: '/assets/home/prewedding-1.jpeg', alt: 'Pre-wedding couple portrait under chandelier lights', size: 'square' },
  { id: 'h-1', title: 'Haldhi Ceremony', category: 'Haldhi', image: '/assets/home/haldhi.JPG', alt: 'Couple smiling together during a haldhi water ceremony', size: 'tall' },
  { id: 'w-1', title: 'Sacred Vows', category: 'Wedding', image: '/assets/home/wedding-1.jpeg', alt: 'Wedding couple sharing a joyful ceremony moment', size: 'tall' },
  { id: 'r-1', title: 'Reception Glow', category: 'Reception', image: '/assets/home/cta-wedding (2).jpg', alt: 'Reception couple walking through a monochrome stage scene', size: 'wide' },
  { id: 'b-1', title: 'Joyful Birthday', category: 'Birthday', image: '/assets/home/birthday-1.jpg', alt: 'Birthday celebration with warm ambient lighting', size: 'wide' },
  { id: 'bs-1', title: 'Tiny Smiles', category: 'Baby Shoot', image: '/assets/home/baby-1.jpg', alt: 'Baby portrait in warm studio lighting', size: 'square' }
];

export const stats: StatItem[] = [
  { value: '500+', label: 'Events Covered' },
  { value: '8+', label: 'Years Experience' },
  { value: '1000+', label: 'Happy Clients' },
  { value: '50+', label: 'Awards & Recognition' }
];

export const testimonials: Testimonial[] = [
  { id: 't1', name: 'Akhil & Sravya', eventType: 'Wedding Story', text: 'Every frame felt emotional and cinematic. Our wedding story looked exactly how we dreamed it would.', image: '/assets/home/testimonial-1.jpg' },
  { id: 't2', name: 'Rohit Family', eventType: 'Baby Shoot', text: 'The baby shoot was calm, thoughtful, and beautifully styled. We now have memories we will treasure forever.', image: '/assets/home/testimonial-2.jpg' },
  { id: 't3', name: 'Megha Events', eventType: 'Reception Story', text: 'Professional, punctual, and artistically sharp. The event coverage felt polished across every important moment.', image: '/assets/home/IMG_7211.JPG (1).jpeg' },
  { id: 't4', name: 'Nikhil & Divya', eventType: 'Pre-Wedding Film', text: 'From pre-wedding to reels, everything had elegance and story depth. Truly a high-end experience.', image: '/assets/home/IMG_6565.JPG.jpeg' }
];

export const instagram: InstagramItem[] = [
  { id: 'i1', image: '/assets/home/insta-1.jpeg', alt: 'Wedding details close-up' },
  { id: 'i2', image: '/assets/home/insta-2.jpg', alt: 'Candid bride portrait' },
  { id: 'i3', image: '/assets/home/insta-3.jpeg', alt: 'Couple cinematic frame' },
  { id: 'i4', image: '/assets/home/insta-4.jpg', alt: 'Maternity portrait detail' },
  { id: 'i5', image: '/assets/home/insta-5.jpg', alt: 'Baby smile portrait' },
  { id: 'i6', image: '/assets/home/insta-6 (2).jpg', alt: 'Event atmosphere shot' }
];

