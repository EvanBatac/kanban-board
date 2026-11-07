import { useState } from "react";
import api from "../api/client";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { name, email, password, confirmPassword } = formData;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      await api.post("/auth/register", { name, email, password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section
        className="auth-card auth-card-register"
        aria-labelledby="register-title"
      >
        <a className="brand" href="/register" aria-label="Kanban home">
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
          <p className="eyebrow">GET STARTED</p>
          <h1 id="register-title">Make room for your best work.</h1>
          <p>Create your account and bring your projects into focus.</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              name="name"
              value={name}
              type="text"
              autoComplete="name"
              onChange={handleChange}
              placeholder="Your name"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              value={email}
              type="email"
              autoComplete="email"
              onChange={handleChange}
              required
              placeholder="you@example.com"
            />
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                value={password}
                type="password"
                autoComplete="new-password"
                onChange={handleChange}
                required
                placeholder="Create a password"
              />
            </div>
            <div className="field">
              <label htmlFor="confirmPassword">Confirm password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                type="password"
                autoComplete="new-password"
                onChange={handleChange}
                required
                placeholder="Repeat password"
              />
            </div>
          </div>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button className="auth-submit" type="submit" disabled={isLoading}>
            {isLoading ? "Creating account…" : "Create account"}
            <span aria-hidden="true">→</span>
          </button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </section>
      <p className="auth-footnote">
        A little more clarity, one task at a time.
      </p>
    </main>
  );
}
