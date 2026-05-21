import { Link, useRouteError } from "react-router-dom";

export function RouteErrorPage() {
  const error = useRouteError();
  const message = error?.message || "The page could not be rendered.";

  return (
    <section className="section">
      <div className="container setup-banner setup-banner--error">
        <h1>Page failed to load</h1>
        <p>{message}</p>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    </section>
  );
}

