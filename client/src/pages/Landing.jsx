import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const tasks = [
  {
    title: "Map out the launch plan",
    tag: "Planning",
    color: "bg-[#e9f3ec] text-[#34724b]",
    avatar: "M",
    avatarColor: "bg-[#f2dfd2] text-[#835c45]",
  },
  {
    title: "Polish the onboarding flow",
    tag: "Design",
    color: "bg-[#f2ebfa] text-[#76549b]",
    avatar: "J",
    avatarColor: "bg-[#e1eafa] text-[#526c9b]",
  },
  {
    title: "Review homepage copy",
    tag: "Content",
    color: "bg-[#fbf1df] text-[#97733a]",
    avatar: "A",
    avatarColor: "bg-[#f6e5e7] text-[#a25e69]",
  },
];

function Mark() {
  return (
    <span
      className="flex h-8 items-end gap-1 rounded-[10px] bg-[#eaf4ed] p-1.5"
      aria-hidden="true"
    >
      <i className="h-2 w-1 rounded-sm bg-[#438c61] opacity-70" />
      <i className="h-3.5 w-1 rounded-sm bg-[#438c61]" />
      <i className="h-2.5 w-1 rounded-sm bg-[#438c61] opacity-80" />
    </span>
  );
}

export default function Landing() {
  const { user, isLoading } = useAuth();
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f9f6] text-[#17231f]">
      <header className="relative z-10 mx-auto flex h-19 max-w-6xl items-center justify-between px-6 max-[520px]:px-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 text-[20px] font-bold tracking-[-0.8px] text-[#1c3026] no-underline"
        >
          <Mark />
          <span>
            kanban<span className="text-[#3b9565]">.</span>
          </span>
        </Link>
        <nav
          className="flex items-center gap-6 max-[520px]:gap-3"
          aria-label="Main navigation"
        >
          {isLoading ? (
            <span aria-hidden="true" className="h-10 w-36" />
          ) : user ? (
            <Link
              to="/boards"
              className="rounded-[10px] bg-[#287449] px-4 py-2.5 text-sm font-bold text-white no-underline shadow-[0_4px_10px_rgba(40,116,73,.15)] transition hover:-translate-y-px hover:bg-[#20653e]"
            >
              Open boards <span aria-hidden="true">→</span>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-semibold text-[#526057] no-underline hover:text-[#287449]"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-[10px] bg-[#287449] px-4 py-2.5 text-sm font-bold text-white no-underline shadow-[0_4px_10px_rgba(40,116,73,.15)] transition hover:-translate-y-px hover:bg-[#20653e]"
              >
                Get started <span aria-hidden="true">→</span>
              </Link>
            </>
          )}
        </nav>
      </header>

      <section className="relative mx-auto grid max-w-6xl grid-cols-[1fr_1.03fr] items-center gap-12 px-6 pt-15 pb-24 max-[850px]:grid-cols-1 max-[850px]:gap-14 max-[520px]:px-4 max-[520px]:pt-9 max-[520px]:pb-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-[42%] h-96 w-96 rounded-full bg-[#dff0e3] opacity-60 blur-[90px]"
        />
        <div className="relative z-1 max-w-127.5">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#dce9df] bg-white/75 px-3 py-1.5 text-[11px] font-bold tracking-[.5px] text-[#43815a]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#53a66e]" /> A calmer
            way to get things done
          </div>
          <h1 className="m-0 text-[clamp(44px,6.2vw,72px)] leading-[1.02] font-semibold tracking-[-4.5px] text-[#1d3025] max-[520px]:tracking-[-2.8px]">
            Make room for
            <br />
            <span className="text-[#438c61]">great work.</span>
          </h1>
          <p className="mt-6 mb-0 max-w-110 text-[17px] leading-[1.7] text-[#6e7b72]">
            Bring your tasks into focus, keep your team in sync, and move every
            project forward—one clear step at a time.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {isLoading ? (
              <span aria-hidden="true" className="h-12 w-44" />
            ) : user ? (
              <Link
                to="/boards"
                className="group inline-flex items-center gap-3 rounded-[11px] bg-[#287449] px-5 py-3.5 text-sm font-bold text-white no-underline shadow-[0_7px_18px_rgba(40,116,73,.2)] transition hover:-translate-y-0.5 hover:bg-[#20653e]"
              >
                Open your boards{" "}
                <span
                  className="text-lg transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="group inline-flex items-center gap-3 rounded-[11px] bg-[#287449] px-5 py-3.5 text-sm font-bold text-white no-underline shadow-[0_7px_18px_rgba(40,116,73,.2)] transition hover:-translate-y-0.5 hover:bg-[#20653e]"
                >
                  Start organizing{" "}
                  <span
                    className="text-lg transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </Link>
                <span className="text-xs font-medium text-[#89948c]">
                  Free to get started
                </span>
              </>
            )}
          </div>
          <div className="mt-10 flex items-center gap-3 text-xs text-[#77837a]">
            <div className="flex -space-x-2" aria-hidden="true">
              <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#f7f9f6] bg-[#f2dfd2] text-[10px] font-bold text-[#835c45]">
                M
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#f7f9f6] bg-[#e1eafa] text-[10px] font-bold text-[#526c9b]">
                J
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#f7f9f6] bg-[#e8ecd4] text-[10px] font-bold text-[#637341]">
                A
              </span>
            </div>
            <span>
              <strong className="text-[#46564b]">Less juggling.</strong> More
              getting there.
            </span>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="relative z-1 mx-auto w-full max-w-137.5 rotate-1 rounded-[20px] border border-[#e4eae5] bg-white p-5 shadow-[0_30px_80px_rgba(32,65,44,.13),0_4px_12px_rgba(32,65,44,.04)] max-[520px]:p-3.5"
        >
          <div className="flex items-center justify-between border-b border-[#eff2ef] pb-4">
            <div>
              <p className="m-0 text-[10px] font-bold tracking-[1.2px] text-[#8b968e]">
                YOUR WORKSPACE
              </p>
              <h2 className="mt-1 mb-0 text-[17px] font-bold tracking-[-.4px] text-[#26372c]">
                Website refresh
              </h2>
            </div>
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#edf0ed] text-lg text-[#7c887f]"
              aria-hidden="true"
            >
              ···
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-4 max-[520px]:gap-2">
            {[
              { name: "TO DO", count: "03" },
              { name: "IN PROGRESS", count: "02" },
              { name: "DONE", count: "04" },
            ].map((column, index) => (
              <div
                key={column.name}
                className="min-w-0 rounded-xl bg-[#f7f9f7] p-2.5 max-[520px]:p-1.5"
              >
                <div className="mb-2.5 flex items-center justify-between gap-1">
                  <span className="truncate text-[9px] font-extrabold tracking-[.65px] text-[#77837a]">
                    {column.name}
                  </span>
                  <span className="text-[9px] font-bold text-[#a1aaa3]">
                    {column.count}
                  </span>
                </div>
                {(index === 0
                  ? tasks
                  : index === 1
                    ? tasks.slice(0, 2)
                    : tasks.slice(1, 2)
                ).map((task, i) => (
                  <article
                    key={`${column.name}-${task.title}`}
                    className="mb-2 rounded-[9px] border border-[#e9eeea] bg-white p-2.5 shadow-[0_2px_5px_rgba(32,65,44,.025)] last:mb-0 max-[520px]:p-2"
                  >
                    <span
                      className={`inline-block rounded px-1.5 py-0.5 text-[8px] font-bold ${task.color}`}
                    >
                      {index === 2 ? "Shipped" : task.tag}
                    </span>
                    <h3 className="mt-2 mb-2.5 text-[10px] leading-[1.4] font-semibold text-[#334238] max-[520px]:text-[9px]">
                      {index === 0 && i === 0
                        ? task.title
                        : index === 1 && i === 0
                          ? "Build reusable components"
                          : task.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] text-[#98a29b]">
                        {index === 2 ? "Done" : "Oct 24"}
                      </span>
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full text-[8px] font-bold ${task.avatarColor}`}
                      >
                        {task.avatar}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between rounded-lg bg-[#f5f8f5] px-3 py-2">
            <span className="text-[10px] font-medium text-[#77837a]">
              A little progress adds up.
            </span>
            <span className="text-[10px] font-bold text-[#438c61]">
              ↗ 64% complete
            </span>
          </div>
        </div>
      </section>
      <section
        className="mx-auto max-w-6xl px-6 pb-20 max-[520px]:px-4 max-[520px]:pb-14"
        aria-label="Features"
      >
        <div className="grid grid-cols-3 gap-4 max-[700px]:grid-cols-1">
          <article className="rounded-2xl border border-[#e4eae5] bg-white p-5 shadow-[0_8px_24px_rgba(32,65,44,.045)]">
            <span
              className="mb-4 flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#eaf4ed] text-[#438c61]"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect x="3.5" y="4" width="7" height="7" rx="1.5" />
                <rect x="13.5" y="4" width="7" height="7" rx="1.5" />
                <rect x="3.5" y="14" width="7" height="6" rx="1.5" />
                <path d="M17 14v6m-3-3h6" />
              </svg>
            </span>
            <h2 className="m-0 text-[15px] font-bold tracking-[-.3px] text-[#26372c]">
              Drag and drop boards
            </h2>
            <p className="mt-2 mb-0 text-[13px] leading-[1.6] text-[#77837a]">
              Move tasks along and see progress take shape.
            </p>
          </article>
          <article className="rounded-2xl border border-[#e4eae5] bg-white p-5 shadow-[0_8px_24px_rgba(32,65,44,.045)]">
            <span
              className="mb-4 flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#f2ebfa] text-[#76549b]"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="9" cy="8" r="3" />
                <path d="M3.5 19c.3-3 2.3-5 5.5-5s5.2 2 5.5 5M17 6.5a2.5 2.5 0 0 1 0 5m1 2c1.7.6 2.5 2 2.7 4" />
              </svg>
            </span>
            <h2 className="m-0 text-[15px] font-bold tracking-[-.3px] text-[#26372c]">
              Teams, roles, and assignees
            </h2>
            <p className="mt-2 mb-0 text-[13px] leading-[1.6] text-[#77837a]">
              Give everyone a clear place and part to play.
            </p>
          </article>
          <article className="rounded-2xl border border-[#e4eae5] bg-white p-5 shadow-[0_8px_24px_rgba(32,65,44,.045)]">
            <span
              className="mb-4 flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#fbf1df] text-[#97733a]"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M4 5.5h16v11H11l-5 3v-3H4z" />
                <path d="M8 9h8m-8 4h5" />
              </svg>
            </span>
            <h2 className="m-0 text-[15px] font-bold tracking-[-.3px] text-[#26372c]">
              Activity and comments
            </h2>
            <p className="mt-2 mb-0 text-[13px] leading-[1.6] text-[#77837a]">
              Keep decisions and updates close to the work.
            </p>
          </article>
        </div>
      </section>
      <footer className="mx-auto flex max-w-6xl items-center justify-between border-t border-[#e9eeea] px-6 py-5 text-[11px] text-[#929d95] max-[520px]:px-4">
        <span>
          kanban<span className="text-[#3b9565]">.</span> &nbsp;Make progress
          visible.
        </span>
        <span>One task at a time.</span>
      </footer>
    </main>
  );
}
