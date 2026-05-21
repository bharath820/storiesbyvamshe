import { NavLink } from "react-router-dom";

const quickLinks = [
  { to: "/", label: "Home" },
  { to: "/gallery", label: "Gallery" },
  { to: "/videos", label: "Videos" },
  { to: "/blogs", label: "VBlogs" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" }
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__grid">
          <section className="site-footer__col site-footer__col--about">
            <h2 className="site-footer__title">About Stories by Vamshe</h2>
            <p className="site-footer__about">
              Stories by Vamshe is your storytelling studio for weddings, pre-weddings, and events. We
              blend candid emotion with cinematic visuals so every celebration lives on through timeless
              frames.
            </p>
          </section>

          <section className="site-footer__col">
            <h2 className="site-footer__title">Quick Links</h2>
            <nav className="site-footer__links" aria-label="Quick links">
              {quickLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => `site-footer__link${isActive ? " active" : ""}`}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </section>

          <section className="site-footer__col">
            <h2 className="site-footer__title">Contact Us</h2>
            <ul className="site-footer__contact">
              <li>
                <strong>Email:</strong>
                <a href="mailto:storiesbyvamshe9@gmail.com">storiesbyvamshe9@gmail.com</a>
              </li>
              <li>
                <strong>Phone:</strong>
                <span>+91 90305 01106</span>
              </li>
              <li>
                <strong>Location:</strong>
                <span>Hyderabad, Telangana</span>
              </li>
            </ul>
          </section>
        </div>

        <div className="site-footer__bottom">
          <p>
            {"\u00A9"} {new Date().getFullYear()} Stories by Vamshe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
