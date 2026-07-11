import { createBrowserRouter } from "react-router-dom";
import { SiteHeader } from "../components/layout/SiteHeader.tsx";
import { SiteFooter } from "../components/layout/SiteFooter.tsx";
import { HomePage } from "../pages/HomePage.tsx";
import { GalleryPage } from "../pages/GalleryPage";
import { VideosPage } from "../pages/VideosPage";
import { BlogsPage } from "../pages/BlogsPage";
import { BlogDetailPage } from "../pages/BlogDetailPage";
import { ContactPage } from "../pages/ContactPage";
import { AboutPage } from "../pages/AboutPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { AdminLoginPage } from "../pages/admin/AdminLoginPage";
import { AdminDashboardPage } from "../pages/admin/AdminDashboardPage";
import { AdminCategoriesPage } from "../pages/admin/AdminCategoriesPage";
import { AdminPhotosPage } from "../pages/admin/AdminPhotosPage";
import { AdminVideosPage } from "../pages/admin/AdminVideosPage";
import { AdminBlogsPage } from "../pages/admin/AdminBlogsPage";
import { AdminHomepagePage } from "../pages/admin/AdminHomepagePage";
import { AdminLayout } from "../components/admin/AdminLayout";
import { ProtectedRoute } from "../components/admin/ProtectedRoute";
import { RouteErrorPage } from "../pages/RouteErrorPage";

function PublicLayout({ children }) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <RouteErrorPage />,
    element: (
      <PublicLayout>
        <HomePage />
      </PublicLayout>
    )
  },
  {
    path: "/gallery",
    errorElement: <RouteErrorPage />,
    element: (
      <PublicLayout>
        <GalleryPage />
      </PublicLayout>
    )
  },
  {
    path: "/videos",
    errorElement: <RouteErrorPage />,
    element: (
      <PublicLayout>
        <VideosPage />
      </PublicLayout>
    )
  },
  {
    path: "/blogs",
    errorElement: <RouteErrorPage />,
    element: (
      <PublicLayout>
        <BlogsPage />
      </PublicLayout>
    )
  },
  {
    path: "/blogs/:slug",
    errorElement: <RouteErrorPage />,
    element: (
      <PublicLayout>
        <BlogDetailPage />
      </PublicLayout>
    )
  },
  {
    path: "/contact",
    errorElement: <RouteErrorPage />,
    element: (
      <PublicLayout>
        <ContactPage />
      </PublicLayout>
    )
  },
  {
    path: "/about",
    errorElement: <RouteErrorPage />,
    element: (
      <PublicLayout>
        <AboutPage />
      </PublicLayout>
    )
  },
  {
    path: "/admin/login",
    errorElement: <RouteErrorPage />,
    element: <AdminLoginPage />
  },
  {
    path: "/admin",
    errorElement: <RouteErrorPage />,
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: "categories", element: <AdminCategoriesPage /> },
      { path: "photos", element: <AdminPhotosPage /> },
      { path: "videos", element: <AdminVideosPage /> },
      { path: "blogs", element: <AdminBlogsPage /> },
      { path: "homepage", element: <AdminHomepagePage /> }
    ]
  },
  {
    path: "*",
    errorElement: <RouteErrorPage />,
    element: (
      <PublicLayout>
        <NotFoundPage />
      </PublicLayout>
    )
  }
]);
