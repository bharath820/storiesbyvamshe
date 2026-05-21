import React from "react";

export class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    // Keep a console trail for debugging while showing a friendly UI.
    console.error("App crashed:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="section">
          <div className="container setup-banner setup-banner--error">
            <h2>Something went wrong</h2>
            <p>Reload this page. If it still fails, check your `.env` setup and restart the app.</p>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}
