import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DUMMY_ADMIN_EMAIL, DUMMY_ADMIN_PASSWORD, loginAdmin } from "../../lib/auth";
import { isFirebaseConfigured } from "../../lib/firebaseClient";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await loginAdmin(email, password);
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="admin-login-wrap">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <h1>Admin Login</h1>
        <p className="section-subtitle">{isFirebaseConfigured
          ? "Sign in with the admin account created in Firebase Authentication."
          : <>Demo mode: use <strong>{DUMMY_ADMIN_EMAIL}</strong> and <strong>{DUMMY_ADMIN_PASSWORD}</strong></>}</p>
        <label className="field">
          <span>Email</span>
          <input
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={isFirebaseConfigured ? "admin@example.com" : DUMMY_ADMIN_EMAIL}
          />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
          />
        </label>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </section>
  );
}
