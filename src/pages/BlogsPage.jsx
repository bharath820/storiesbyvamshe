import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ResolvedImage } from "../components/media/ResolvedImage";
import { subscribePublishedCollection } from "../lib/firestoreService";
import { prettyDate } from "../utils/format";

export function BlogsPage() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    return subscribePublishedCollection("blogs", (rows) => {
      setBlogs([...rows].sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || ""))));
    });
  }, []);

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">VBlogs</h1>
        <p className="section-subtitle">Stories, event insights, and cinematic photography journals.</p>
        <div className="blog-grid">
          {blogs.slice(0, 8).map((blog) => (
            <article key={blog.id} className="blog-card">
              {blog.coverImage && <ResolvedImage src={blog.coverImage} alt={blog.title} />}
              <div className="blog-card__body">
                <small>{prettyDate(blog.publishedAt || blog.createdAt)}</small>
                <h3>{blog.title}</h3>
                <p>{blog.excerpt}</p>
                <Link to={`/blogs/${blog.slug}`} className="blog-link">
                  Read more
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
