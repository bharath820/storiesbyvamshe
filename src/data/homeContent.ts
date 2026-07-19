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
  'Baby Shoot',
  'Maternity'
] as const;

export const hero: HomeHero = {
  image: '/assets/home/hero-wedding.jpg',
  alt: 'Elegant wedding couple portrait in warm evening light'
};

export const featuredStories: GalleryItem[] = [
  { id: 'e-1', title: 'Ring Story', category: 'Engagement', image: '/assets/home/engagement-1.jpg', alt: 'Engagement couple sharing candid moment', size: 'square' },
  { id: 'pw-1', title: 'Golden Hour Promise', category: 'Pre-Wedding', image: '/assets/home/prewedding-1.jpg', alt: 'Pre-wedding couple portrait outdoors', size: 'wide' },
  { id: 's-1', title: 'Sangeeth Night', category: 'Sangeeth', image: '/assets/home/corporate-1.jpg', alt: 'Celebration event photographed with warm stage lighting', size: 'tall' },
  { id: 'h-1', title: 'Haldhi Ceremony', category: 'Haldhi', image: '/assets/home/wedding-1.jpg', alt: 'Wedding ritual detail captured in soft natural light', size: 'square' },
  { id: 'w-1', title: 'Sacred Vows', category: 'Wedding', image: '/assets/home/wedding-1.jpg', alt: 'Wedding couple holding hands during ceremony', size: 'tall' },
  { id: 'r-1', title: 'Reception Glow', category: 'Reception', image: '/assets/home/wedding-2.jpg', alt: 'Reception couple portrait with celebratory styling', size: 'wide' },
  { id: 'b-1', title: 'Joyful Birthday', category: 'Birthday', image: '/assets/home/birthday-1.jpg', alt: 'Birthday celebration with warm ambient lighting', size: 'wide' },
  { id: 'bs-1', title: 'Tiny Smiles', category: 'Baby Shoot', image: '/assets/home/baby-1.jpg', alt: 'Baby portrait in warm studio lighting', size: 'square' },
  { id: 'm-1', title: 'Motherhood Glow', category: 'Maternity', image: '/assets/home/maternity-1.jpg', alt: 'Maternity portrait in warm natural light', size: 'tall' }
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
  { id: 't3', name: 'Megha Events', eventType: 'Corporate Event', text: 'Professional, punctual, and artistically sharp. The corporate event coverage looked premium across every shot.', image: '/assets/home/testimonial-3.jpg' },
  { id: 't4', name: 'Nikhil & Divya', eventType: 'Pre-Wedding Film', text: 'From pre-wedding to reels, everything had elegance and story depth. Truly a high-end experience.', image: '/assets/home/testimonial-4.jpg' }
];

export const instagram: InstagramItem[] = [
  { id: 'i1', image: '/assets/home/insta-1.jpg', alt: 'Wedding details close-up' },
  { id: 'i2', image: '/assets/home/insta-2.jpg', alt: 'Candid bride portrait' },
  { id: 'i3', image: '/assets/home/insta-3.jpg', alt: 'Couple cinematic frame' },
  { id: 'i4', image: '/assets/home/insta-4.jpg', alt: 'Maternity portrait detail' },
  { id: 'i5', image: '/assets/home/insta-5.jpg', alt: 'Baby smile portrait' },
  { id: 'i6', image: '/assets/home/insta-6.jpg', alt: 'Event atmosphere shot' }
];

