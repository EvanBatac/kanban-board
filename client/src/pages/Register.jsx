import { useState } from "react";
import api from "../api/client";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { name, email, password, confirmPassword } = formData;
  const [error, setError] = useState("");

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      const data = res.data;
      console.log(data);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          value={name}
          type="text"
          onChange={handleChange}
          placeholder="Enter your name..."
          required
        />
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          value={email}
          type="email"
          onChange={handleChange}
          required
          placeholder="e.g john@gmail.com"
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          value={password}
          type="password"
          onChange={handleChange}
          required
          placeholder="Enter your password"
        />
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          value={confirmPassword}
          onChange={handleChange}
          type="password"
          placeholder="Confirm your password..."
        />
        {error && <p>{error}</p>}
        <button type="submit">Register</button>
      </form>
    </>
  );
}
