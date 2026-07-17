import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ResolvedImage } from "../components/media/ResolvedImage";
import { subscribePublishedCollection } from "../lib/firestoreService";
import { prettyDate } from "../utils/format";

export function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    return subscribePublishedCollection("blogs", (rows) => {
      setBlog(rows.find((item) => item.slug === slug) || null);
    });
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
