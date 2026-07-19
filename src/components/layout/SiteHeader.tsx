import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

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
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur transition-shadow ${
        scrolled ? 'border-b border-brandBorder shadow-sm' : ''
      }`}
    >
      <div className="mx-auto flex w-[min(92%,1220px)] items-center justify-between gap-3 py-2.5 sm:py-3 md:py-4">
        <NavLink to="/" className="flex min-w-0 items-center" aria-label="Stories by Vamshe home">
          <img
            src="/assets/brand/stories-by-vamshe-logo.png"
            alt="Stories by Vamshe logo"
            className="h-11 w-auto max-w-[168px] object-contain sm:h-14 sm:max-w-[230px] md:h-16 md:max-w-[300px]"
            loading="eager"
            decoding="async"
          />
        </NavLink>

        <nav className="hidden items-center gap-5 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm transition ${isActive ? 'text-black' : 'text-brandSubtext hover:text-black'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <NavLink
          to="/contact"
          className="hidden rounded-full border border-brandBorder px-4 py-2 text-sm transition hover:border-brandText md:inline-flex"
        >
          Book A Session
        </NavLink>

        <button
          type="button"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/70 bg-white/70 text-brandText shadow-[0_8px_20px_rgba(30,30,30,0.06)] backdrop-blur transition hover:border-brandGold hover:bg-white md:hidden"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? (
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          ) : (
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div
          id="mobile-navigation"
          className="fixed inset-0 z-[80] md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Main navigation"
        >
          <button
            type="button"
            className="mobile-menu-backdrop absolute inset-0 bg-black/30 backdrop-blur-[3px]"
            aria-label="Close navigation menu"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="mobile-menu-panel absolute right-0 top-0 flex h-[100dvh] w-[min(88vw,360px)] flex-col overflow-y-auto border-l border-[#eee2d2] bg-[#fffdf9] shadow-[0_20px_80px_rgba(32,24,16,0.2)]">
            <div className="flex items-center justify-between gap-3 border-b border-[#efe7dc] bg-[#fffdf9] px-5 py-4">
              <NavLink to="/" className="flex min-w-0 items-center" aria-label="Stories by Vamshe home">
                <img
                  src="/assets/brand/stories-by-vamshe-logo.png"
                  alt="Stories by Vamshe logo"
                  className="h-12 w-auto max-w-[180px] object-contain"
                  loading="eager"
                  decoding="async"
                />
              </NavLink>
              <button
                type="button"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#eadfce] bg-white text-brandText shadow-[0_8px_20px_rgba(30,30,30,0.05)] transition hover:border-brandGold"
                aria-label="Close navigation menu"
                onClick={() => setMenuOpen(false)}
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            <nav className="grid gap-2.5 px-5 py-6" aria-label="Mobile navigation links">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex min-h-12 items-center justify-between rounded-xl border px-4 py-3 text-base font-medium shadow-[0_10px_24px_rgba(42,33,24,0.04)] backdrop-blur transition duration-200 ${
                      isActive
                        ? 'border-brandGold/70 bg-[#f4eadb] text-brandText'
                        : 'border-[#efe7dc] bg-white text-brandText hover:border-brandGold/60 hover:bg-[#fff8ef]'
                    }`
                  }
                >
                  <span>{link.label}</span>
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto grid gap-3 border-t border-[#efe7dc] bg-[#fffdf9] px-5 py-5">
              <NavLink
                to="/contact"
                className="flex min-h-12 items-center justify-center rounded-full bg-brandGold px-5 py-3 text-sm font-medium text-white shadow-[0_12px_28px_rgba(176,141,87,0.28)] transition hover:bg-[#9e7a45]"
              >
                Book A Session
              </NavLink>
              <a
                href="tel:+919030501106"
                className="flex min-h-11 items-center justify-center rounded-full border border-[#eadfce] bg-white px-5 py-3 text-sm font-medium text-brandText transition hover:border-brandGold/60 hover:bg-[#fff8ef]"
              >
                Call Now
              </a>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
