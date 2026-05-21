import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">Page not found</h1>
        <Link to="/" className="btn btn-primary">
          Go Home
        </Link>
      </div>
    </section>
  );
}

