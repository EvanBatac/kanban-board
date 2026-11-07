import api from "../api/client";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { email, password } = formData;

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      setIsLoading(true);
      const res = await api.post("/auth/login", {
        email,
        password,
      });
      login(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          value={email}
          required
          placeholder="e.g john@gmail.com"
          onChange={handleChange}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          required
          placeholder="Enter your password..."
          onChange={handleChange}
        />
        <button disabled={isLoading} type="submit">
          {isLoading ? "Signing in..." : "Log in"}
        </button>
        {error && <p>{error}</p>}
      </form>
    </>
  );
}
