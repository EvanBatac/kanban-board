import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b border-[#e7ece8] bg-[rgba(255,255,255,0.92)] backdrop-blur-xl">
      <nav
        className="mx-auto flex h-17 max-w-6xl items-center justify-between px-6 max-[520px]:h-15 max-[520px]:px-4"
        aria-label="Main navigation"
      >
        <Link
          to="/boards"
          className="inline-flex items-center gap-2.5 text-[19px] font-bold tracking-[-0.7px] text-[#1c3026] no-underline"
        >
          <span
            className="flex h-7 items-end gap-0.75 rounded-lg bg-[#eaf4ed] p-1"
            aria-hidden="true"
          >
            <i className="h-2 w-1 rounded-sm bg-[#438c61] opacity-70" />
            <i className="h-3.5 w-1 rounded-sm bg-[#438c61]" />
            <i className="h-2.5 w-1 rounded-sm bg-[#438c61] opacity-[0.82]" />
          </span>
          <span>
            kanban<span className="text-[#3b9565]">.</span>
          </span>
        </Link>

        <div className="flex items-center gap-3.5 max-[520px]:gap-2.5">
          <div className="flex items-center gap-2.5 text-[13px] font-semibold text-[#35433a] max-[420px]:gap-0">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eaf4ed] text-xs font-bold text-[#287449]"
              aria-hidden="true"
            >
              {user?.name?.trim()?.charAt(0)?.toUpperCase() || "U"}
            </span>
            <span className="max-[420px]:sr-only">{user?.name}</span>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-lg border border-[#dfe6e1] bg-white px-3.5 py-2 text-xs font-bold text-[#35433a] transition-colors hover:border-[#c8d8cd] hover:bg-[#f5f9f6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#438c61] max-[520px]:px-3"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}
