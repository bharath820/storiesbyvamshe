import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ResolvedImage } from "../components/media/ResolvedImage";
import { getPublishedBlogs } from "../lib/firestoreService";
import { subscribeToContentChanges } from "../lib/localDataStore";
import { prettyDate } from "../utils/format";

export function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    let isActive = true;

    async function load() {
      const rows = await getPublishedBlogs();
      if (!isActive) return;
      setBlog(rows.find((item) => item.slug === slug) || null);
    }

    load().catch(() => {});
    const unsubscribe = subscribeToContentChanges(() => {
      load().catch(() => {});
    });

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, [slug]);

  if (!blog) {
    return (
      <section className="section">
        <div className="container">
          <h1 className="section-title">Blog not found</h1>
          <Link to="/blogs" className="btn btn-soft">
            Back to Blogs
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <article className="container blog-detail">
        <small>{prettyDate(blog.publishedAt || blog.createdAt)}</small>
        <h1>{blog.title}</h1>
        {blog.coverImage && <ResolvedImage src={blog.coverImage} alt={blog.title} />}
        <p>{blog.body}</p>
      </article>
    </section>
  );
}
