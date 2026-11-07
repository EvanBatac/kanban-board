import api from "../api/client";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { email, password } = formData;

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      setIsLoading(true);
      const res = await api.post("/auth/login", { email, password });
      login(res.data.data);
      navigate("/boards");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="login-title">
        <a className="brand" href="/login" aria-label="Kanban home">
          <span className="brand-mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>
            kanban<span className="brand-period">.</span>
          </span>
        </a>
        <div className="auth-heading">
          <p className="eyebrow">WELCOME BACK</p>
          <h1 id="login-title">Good to see you again.</h1>
          <p>Pick up where you left off and keep things moving.</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              required
              autoComplete="email"
              placeholder="you@example.com"
              onChange={handleChange}
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              onChange={handleChange}
            />
          </div>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button className="auth-submit" disabled={isLoading} type="submit">
            {isLoading ? "Signing in…" : "Log in"}
            <span aria-hidden="true">→</span>
          </button>
        </form>
        <p className="auth-switch">
          New to kanban? <Link to="/register">Create an account</Link>
        </p>
      </section>
      <p className="auth-footnote">
        A little more clarity, one task at a time.
      </p>
    </main>
  );
}
