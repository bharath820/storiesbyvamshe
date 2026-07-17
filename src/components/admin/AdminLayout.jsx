import { NavLink, Outlet } from "react-router-dom";
import { logoutAdmin } from "../../lib/auth";
import { isFirebaseConfigured } from "../../lib/firebaseClient";

const links = [
  { to: "/admin", label: "Overview", end: true },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/photos", label: "Gallery" },
  { to: "/admin/videos", label: "Videos" },
  { to: "/admin/blogs", label: "VBlogs" },
  { to: "/admin/homepage", label: "Homepage" }
];

export function AdminLayout() {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <button type="button" className="btn btn-soft" onClick={logoutAdmin}>
          Logout
        </button>
      </aside>

      <section className="admin-main">
        {!isFirebaseConfigured && <div className="setup-banner setup-banner--admin"><strong>Local demo mode</strong><p>Add the Firebase environment variables before publishing. Changes currently stay in this browser only.</p></div>}
        <Outlet />
      </section>
    </div>
  );
}
