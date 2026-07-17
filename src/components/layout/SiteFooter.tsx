import { NavLink } from 'react-router-dom';

export function SiteFooter() {
  return (
    <footer className="bg-[#0f0f0f] text-white">
      <div className="section-shell grid gap-8 py-8 md:grid-cols-4 md:gap-6 lg:gap-8">
        <div>
          <p className="font-display text-2xl">Stories by Vamshe</p>
          <p className="mt-3 text-sm text-white/70">Luxury wedding and event storytelling through photographs and cinematic films.</p>
        </div>
        <div>
          <p className="mb-4 text-sm uppercase tracking-[0.22em] text-white/70">Quick Links</p>
          <div className="grid gap-2 text-sm text-white/85">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/gallery">Gallery</NavLink>
            <NavLink to="/videos">Videos</NavLink>
            <NavLink to="/blogs">VBlogs</NavLink>
          </div>
        </div>
        <div>
          <p className="mb-4 text-sm uppercase tracking-[0.22em] text-white/70">Services</p>
          <div className="grid gap-2 text-sm text-white/85">
            <p>Weddings & Engagements</p>
            <p>Baby & Maternity Shoots</p>
            <p>Corporate Events</p>
            <p>Cinematic Reels</p>
          </div>
        </div>
        <div>
          <p className="mb-4 text-sm uppercase tracking-[0.22em] text-white/70">Contact</p>
          <div className="grid gap-2 text-sm text-white/85">
            <a href="mailto:storiesbyvamshe9@gmail.com">storiesbyvamshe9@gmail.com</a>
            <p>+91 90305 01106</p>
            <p>Hyderabad, Telangana</p>
            <p>Instagram: @storiesbyvamshe</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

