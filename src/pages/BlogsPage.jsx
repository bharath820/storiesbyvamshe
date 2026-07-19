import { useEffect, useState } from "react";
import { ResolvedImage } from "../components/media/ResolvedImage";
import { demoBlogs } from "../data/demoContent";
import { subscribePublishedCollection } from "../lib/firestoreService";
import { prettyDate } from "../utils/format";

const BLOG_CARD_LIMIT = 9;

function withStarterBlogs(rows) {
  const publishedRows = Array.isArray(rows) ? rows : [];
  const seen = new Set(publishedRows.flatMap((blog) => [blog.id, blog.slug].filter(Boolean)));
  return [
    ...publishedRows,
    ...demoBlogs.filter((blog) => !seen.has(blog.id) && !seen.has(blog.slug))
  ];
}

export function BlogsPage() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    return subscribePublishedCollection("blogs", (rows) => {
      setBlogs(
        withStarterBlogs(rows).sort((a, b) =>
          String(b.createdAt || "").localeCompare(String(a.createdAt || ""))
        )
      );
    });
  }, []);

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">VBlogs</h1>
        <p className="section-subtitle">Stories, event insights, and cinematic photography journals.</p>
        <div className="blog-grid">
          {blogs.slice(0, BLOG_CARD_LIMIT).map((blog) => (
            <article key={blog.id} className="blog-card">
              {blog.coverImage && <ResolvedImage src={blog.coverImage} alt={blog.title} />}
              <div className="blog-card__body">
                <small>{prettyDate(blog.publishedAt || blog.createdAt)}</small>
                <h3>{blog.title}</h3>
                <p>{blog.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
