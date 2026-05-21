import { NavLink } from "react-router-dom";
import { classNames } from "../../utils/format";

const links = [
  { to: "/", label: "Home" },
  { to: "/gallery", label: "Gallery" },
  { to: "/videos", label: "Videos" },
  { to: "/blogs", label: "VBlogs" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" }
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <NavLink to="/" className="brand-mark">
          <span className="brand-mark__logo">SV</span>
          <span>
            <strong>Stories by Vamshe</strong>
            <small>Photography & Films</small>
          </span>
        </NavLink>
        <nav className="site-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => classNames("site-nav__link", isActive && "active")}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
