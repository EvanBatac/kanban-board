import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";

export default function Boards() {
  const [boards, setBoards] = useState([]);
  const [name, setName] = useState("");
  const [createError, setCreateError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function showBoards() {
      setError("");
      try {
        const res = await api.get("/boards");
        setBoards(res.data.data.boards);
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    }
    showBoards();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setCreateError("");
    try {
      const res = await api.post("/boards", { name });
      const newBoard = res.data?.data?.board;
      setBoards((prev) => [...prev, newBoard]);
      setName("");
    } catch (err) {
      setCreateError(err.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <main className="min-h-[calc(100vh-68px)] bg-[radial-gradient(ellipse_at_50%_0%,#eaf3ec_0%,transparent_42%),#f4f7f4] px-6 py-14 max-[520px]:px-4 max-[520px]:py-9">
      <div className="mx-auto max-w-5xl">
        <div className="mb-9 flex items-end justify-between gap-6 max-[700px]:flex-col max-[700px]:items-stretch max-[700px]:gap-6">
          <div>
            <p className="mb-2 text-[10px] font-extrabold tracking-[1.5px] text-[#438c61]">
              YOUR WORKSPACE
            </p>
            <h1 className="m-0 text-[clamp(28px,5vw,36px)] leading-tight font-bold tracking-[-1.3px] text-[#17231f]">
              Your boards
            </h1>
            <p className="mt-2 mb-0 text-sm text-[#77827b]">
              Keep your projects organized, one board at a time.
            </p>
          </div>

          <form
            onSubmit={handleCreate}
            className="flex w-full max-w-117.5 gap-2.5 rounded-xl border border-[#e7ece8] bg-white p-2 shadow-[0_8px_24px_rgba(27,54,40,0.05)] max-[700px]:max-w-none max-[480px]:flex-col"
          >
            <input
              type="text"
              value={name}
              placeholder="Name your new board"
              aria-label="Board name"
              onChange={(e) => setName(e.target.value)}
              className="h-11 min-w-0 flex-1 rounded-lg border border-transparent bg-[#fbfcfb] px-3.5 text-[13px] text-[#1d2a22] outline-none transition-[border-color,box-shadow,background] placeholder:text-[#a1aaa4] focus:border-[#63a57a] focus:bg-white focus:shadow-[0_0_0_3px_rgba(76,151,99,0.13)]"
            />
            <button
              type="submit"
              className="h-11 shrink-0 rounded-lg border-0 bg-[#287449] px-4 text-[13px] font-bold text-white shadow-[0_4px_10px_rgba(40,116,73,0.15)] transition-colors hover:bg-[#20653e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#438c61] max-[480px]:w-full"
            >
              <span
                className="mr-1.5 text-base leading-none"
                aria-hidden="true"
              >
                +
              </span>
              Create board
            </button>
          </form>
        </div>

        {createError && (
          <p
            className="mb-5 rounded-lg border border-[#f1d4d1] bg-[#fff7f6] px-4 py-3 text-sm text-[#a43d35]"
            role="alert"
          >
            {createError}
          </p>
        )}

        {isLoading ? (
          <div className="rounded-2xl border border-[#e7ece8] bg-white/80 px-6 py-14 text-center text-sm text-[#77827b]">
            Loading your boards…
          </div>
        ) : error ? (
          <div
            className="rounded-2xl border border-[#f1d4d1] bg-[#fff7f6] px-6 py-10 text-center text-sm text-[#a43d35]"
            role="alert"
          >
            {error}
          </div>
        ) : boards.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#cfdcd2] bg-[rgba(255,255,255,0.62)] px-6 py-14 text-center">
            <span
              className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf4ed] text-2xl text-[#438c61]"
              aria-hidden="true"
            >
              ▤
            </span>
            <h2 className="m-0 text-base font-bold text-[#27372d]">
              Start with your first board
            </h2>
            <p className="mt-2 mb-0 text-sm text-[#77827b]">
              Create a board above to start organizing your work.
            </p>
          </div>
        ) : (
          <ul className="m-0 grid list-none grid-cols-3 gap-4 p-0 max-[760px]:grid-cols-2 max-[520px]:grid-cols-1">
            {boards.map((board) => (
              <li key={board.id}>
                <Link
                  to={`/boards/${board.id}`}
                  className="group flex min-h-36 flex-col justify-between rounded-2xl border border-[#e5ebe6] bg-white p-5 no-underline shadow-[0_5px_18px_rgba(27,54,40,0.035)] transition-[transform,border-color,box-shadow] hover:-translate-y-0.5 hover:border-[#b8d0bf] hover:shadow-[0_12px_28px_rgba(27,54,40,0.08)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#438c61]"
                >
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eaf4ed] text-[#438c61]"
                    aria-hidden="true"
                  >
                    ▤
                  </span>
                  <span className="mt-7 flex items-center justify-between gap-3 text-[15px] font-bold tracking-[-0.2px] text-[#26372c]">
                    <span className="truncate">{board.name}</span>
                    <span
                      className="text-lg text-[#8caa94] transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
