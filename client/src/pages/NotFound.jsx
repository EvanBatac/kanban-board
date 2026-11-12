import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_0%,#e0eee5_0%,transparent_52%),#f7f9f6] px-5 py-12 text-[#17231f]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-24 h-80 w-80 rounded-full border border-[rgba(47,111,82,0.08)] shadow-[0_0_0_32px_rgba(47,111,82,0.025),0_0_0_64px_rgba(47,111,82,0.02)]"
      />
      <section className="relative w-full max-w-lg rounded-[22px] border border-[#e4eae5] bg-white/90 px-9 py-10 text-center shadow-[0_24px_70px_rgba(27,54,40,0.09)] max-[520px]:px-6">
        <div
          className="mx-auto mb-6 flex h-12 w-12 items-end justify-center gap-1 rounded-[14px] bg-[#eaf4ed] p-2"
          aria-hidden="true"
        >
          <i className="h-3 w-1.5 rounded-sm bg-[#438c61] opacity-70" />
          <i className="h-5 w-1.5 rounded-sm bg-[#438c61]" />
          <i className="h-4 w-1.5 rounded-sm bg-[#438c61] opacity-80" />
        </div>
        <p className="mb-2 text-[11px] font-extrabold tracking-[1.5px] text-[#438c61]">
          404 · PAGE NOT FOUND
        </p>
        <h1 className="m-0 text-[clamp(28px,6vw,38px)] leading-tight font-semibold tracking-[-1.4px] text-[#1d3025]">
          Looks like this task went missing.
        </h1>
        <p className="mt-3 mb-0 text-sm leading-[1.7] text-[#77827b]">
          The page you’re looking for isn’t here. Head back and find your way
          around.
        </p>
        <Link
          to="/"
          className="group mt-7 inline-flex items-center gap-2 rounded-[10px] bg-[#287449] px-5 py-3 text-sm font-bold text-white no-underline shadow-[0_5px_12px_rgba(40,116,73,0.17)] transition hover:-translate-y-px hover:bg-[#20653e]"
        >
          Back to home{" "}
          <span
            className="text-base transition-transform group-hover:-translate-x-0.5"
            aria-hidden="true"
          >
            ←
          </span>
        </Link>
      </section>
    </main>
  );
}
