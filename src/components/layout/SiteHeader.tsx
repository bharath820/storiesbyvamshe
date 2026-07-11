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
    <header className={`fixed inset-x-0 top-0 z-50 transition ${scrolled ? 'border-b border-brandBorder bg-white/75 backdrop-blur-md' : 'bg-white/95'}`}>
      <div className="mx-auto flex w-[min(94%,1220px)] items-center justify-between gap-4 py-4">
        <NavLink to="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-black text-xs text-white">SV</span>
          <span className="hidden sm:block">
            <strong className="block font-display text-lg font-medium">Stories by Vamshe</strong>
            <small className="text-xs text-brandSubtext">Photography & Films</small>
          </span>
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

