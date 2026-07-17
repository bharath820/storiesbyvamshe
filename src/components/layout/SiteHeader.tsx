import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';

const links = [
  { to: '/', label: 'Home' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/videos', label: 'Videos' },
  { to: '/blogs', label: 'VBlogs' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' }
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow ${
        scrolled ? 'border-b border-brandBorder shadow-sm' : ''
      }`}
    >
      <div className="mx-auto flex w-[min(94%,1220px)] items-center justify-between gap-4 py-3 sm:py-4">
        <NavLink to="/" className="flex items-center">
          <img
            src="/assets/brand/stories-by-vamshe-logo.png"
            alt="Stories by Vamshe logo"
            className="h-14 w-auto max-w-[240px] object-contain sm:h-16 sm:max-w-[300px]"
            loading="eager"
            decoding="async"
          />
        </NavLink>
        <nav className="hidden items-center gap-5 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => `text-sm transition ${isActive ? 'text-black' : 'text-brandSubtext hover:text-black'}`}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <button className="rounded-full border border-brandBorder px-4 py-2 text-xs sm:text-sm">Book A Session</button>
      </div>
    </header>
  );
}

