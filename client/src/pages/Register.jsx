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
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_0%,#e0eee5_0%,transparent_52%),#f4f7f4] px-5 pt-12 pb-6 max-[520px]:px-3.5 max-[520px]:pt-6 max-[520px]:pb-4.5">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-36.25 -left-31.25 h-70 w-70 rounded-full border border-[rgba(47,111,82,0.08)] shadow-[0_0_0_32px_rgba(47,111,82,0.025),0_0_0_64px_rgba(47,111,82,0.02)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28.75 -bottom-47.5 h-92.5 w-92.5 rounded-full border border-[rgba(47,111,82,0.08)] shadow-[0_0_0_32px_rgba(47,111,82,0.025),0_0_0_64px_rgba(47,111,82,0.02)]"
      />
      <section
        className="relative z-1 w-full max-w-135 rounded-[22px] border border-[#e7ece8] bg-[rgba(255,255,255,0.94)] px-10.5 pt-9.5 pb-7.5 shadow-[0_24px_70px_rgba(27,54,40,0.09),0_3px_10px_rgba(27,54,40,0.03)] max-[520px]:rounded-[17px] max-[520px]:px-5.75 max-[520px]:pt-7.5 max-[520px]:pb-6.25"
        aria-labelledby="register-title"
      >
        <Link
          className="inline-flex items-center gap-2.5 text-[19px] font-bold tracking-[-0.7px] text-[#1c3026] no-underline"
          to="/register"
          aria-label="Kanban home"
        >
          <span
            className="flex h-5.5 items-end gap-0.75 rounded-[7px] bg-[#eaf4ed] p-0.75"
            aria-hidden="true"
          >
            <i className="h-2 w-1 rounded-sm bg-[#438c61] opacity-70" />
            <i className="h-3.25 w-1 rounded-sm bg-[#438c61]" />
            <i className="h-2.5 w-1 rounded-sm bg-[#438c61] opacity-[0.82]" />
          </span>
          <span>
            kanban<span className="text-[#3b9565]">.</span>
          </span>
        </Link>
        <div className="mt-8.75 mb-6.75 max-[520px]:mt-7.25 max-[520px]:mb-5.75">
          <p className="mb-2.5 text-[10px] leading-[1.4] font-extrabold tracking-[1.5px] text-[#438c61]">
            GET STARTED
          </p>
          <h1
            id="register-title"
            className="m-0 max-w-97.5 text-[clamp(26px,5vw,32px)] leading-[1.15] tracking-[-1.2px] text-[#17231f]"
          >
            Make room for your best work.
          </h1>
          <p className="mt-2.5 mb-0 text-sm leading-[1.55] text-[#77827b]">
            Create your account and bring your projects into focus.
          </p>
        </div>
        <form className="flex flex-col gap-4.25" onSubmit={handleSubmit}>
          <div className="flex min-w-0 flex-col gap-1.75">
            <label
              className="text-xs font-semibold text-[#35433a]"
              htmlFor="name"
            >
              Full name
            </label>
            <input
              id="name"
              name="name"
              value={name}
              type="text"
              autoComplete="name"
              onChange={handleChange}
              className="h-11.5 w-full rounded-[9px] border border-[#dfe6e1] bg-[#fbfcfb] px-3.25 text-[13px] text-[#1d2a22] outline-none transition-[border-color,box-shadow,background] duration-180 placeholder:text-[#a1aaa4] focus:border-[#63a57a] focus:bg-white focus:shadow-[0_0_0_3px_rgba(76,151,99,0.13)]"
              placeholder="Your name"
              required
            />
          </div>
          <div className="flex min-w-0 flex-col gap-1.75">
            <label
              className="text-xs font-semibold text-[#35433a]"
              htmlFor="email"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              value={email}
              type="email"
              autoComplete="email"
              onChange={handleChange}
              className="h-11.5 w-full rounded-[9px] border border-[#dfe6e1] bg-[#fbfcfb] px-3.25 text-[13px] text-[#1d2a22] outline-none transition-[border-color,box-shadow,background] duration-180 placeholder:text-[#a1aaa4] focus:border-[#63a57a] focus:bg-white focus:shadow-[0_0_0_3px_rgba(76,151,99,0.13)]"
              required
              placeholder="you@example.com"
            />
          </div>
          <div className="grid grid-cols-2 gap-3.25 max-[520px]:grid-cols-1">
            <div className="flex min-w-0 flex-col gap-1.75">
              <label
                className="text-xs font-semibold text-[#35433a]"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                value={password}
                type="password"
                autoComplete="new-password"
                onChange={handleChange}
                className="h-11.5 w-full rounded-[9px] border border-[#dfe6e1] bg-[#fbfcfb] px-3.25 text-[13px] text-[#1d2a22] outline-none transition-[border-color,box-shadow,background] duration-180 placeholder:text-[#a1aaa4] focus:border-[#63a57a] focus:bg-white focus:shadow-[0_0_0_3px_rgba(76,151,99,0.13)]"
                required
                placeholder="Create a password"
              />
            </div>
            <div className="flex min-w-0 flex-col gap-1.75">
              <label
                className="text-xs font-semibold text-[#35433a]"
                htmlFor="confirmPassword"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                type="password"
                autoComplete="new-password"
                onChange={handleChange}
                className="h-11.5 w-full rounded-[9px] border border-[#dfe6e1] bg-[#fbfcfb] px-3.25 text-[13px] text-[#1d2a22] outline-none transition-[border-color,box-shadow,background] duration-180 placeholder:text-[#a1aaa4] focus:border-[#63a57a] focus:bg-white focus:shadow-[0_0_0_3px_rgba(76,151,99,0.13)]"
                required
                placeholder="Repeat password"
              />
            </div>
          </div>
          {error && (
            <p className="-mt-1 text-xs text-[#b33b3b]" role="alert">
              {error}
            </p>
          )}
          <button
            className="mt-0.5 flex min-h-11.75 w-full items-center justify-center gap-2.5 rounded-[9px] border-0 bg-[#287449] text-[13px] font-bold text-white shadow-[0_5px_12px_rgba(40,116,73,0.17)] transition-[background,transform,box-shadow] duration-180 hover:-translate-y-px hover:bg-[#20653e] hover:shadow-[0_7px_16px_rgba(40,116,73,0.22)] disabled:cursor-wait disabled:opacity-70"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Creating account…" : "Create account"}
            <span className="text-[17px] leading-none" aria-hidden="true">
              →
            </span>
          </button>
        </form>
        <p className="mt-5.75 border-t border-[#edf0ed] pt-5 text-center text-xs text-[#7a857e]">
          Already have an account?{" "}
          <Link
            className="font-bold text-[#287449] no-underline hover:underline"
            to="/login"
          >
            Log in
          </Link>
        </p>
      </section>
      <p className="relative z-1 mt-5 text-[11px] tracking-[0.1px] text-[#95a099]">
        A little more clarity, one task at a time.
      </p>
    </main>
  );
}
