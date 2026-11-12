import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";

export default function Boards() {
  const [boards, setBoards] = useState([]);
  const [name, setName] = useState("");
  const [createError, setCreateError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [boardToDelete, setBoardToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
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
      const newBoard = { ...res.data?.data?.board, role: "owner" };
      setBoards((prev) => [...prev, newBoard]);
      setName("");
    } catch (err) {
      setCreateError(err.response?.data?.message || "Something went wrong");
    }
  }

  async function handleDeleteBoard(boardId) {
    setDeleteError("");
    setIsDeleting(true);
    try {
      await api.delete(`/boards/${boardId}`);
      setBoards((prev) => prev.filter((board) => board.id !== boardId));
      setBoardToDelete(null);
    } catch (err) {
      setDeleteError(err.response?.data?.message || "Could not delete board");
      setBoardToDelete(null);
    } finally {
      setIsDeleting(false);
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

        {deleteError && (
          <p
            className="mb-5 rounded-lg border border-[#f1d4d1] bg-[#fff7f6] px-4 py-3 text-sm text-[#a43d35]"
            role="alert"
          >
            {deleteError}
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
              <li
                key={board.id}
                className="relative flex min-h-36 flex-col rounded-2xl border border-[#e5ebe6] bg-white shadow-[0_5px_18px_rgba(27,54,40,0.035)] transition-[transform,border-color,box-shadow] hover:-translate-y-0.5 hover:border-[#b8d0bf] hover:shadow-[0_12px_28px_rgba(27,54,40,0.08)]"
              >
                <Link
                  to={`/boards/${board.id}`}
                  className="group flex min-h-36 flex-1 flex-col justify-between p-5 pr-14 no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#438c61]"
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
                {board.role === "owner" && (
                  <button
                    type="button"
                    aria-label={`Delete ${board.name} board`}
                    title="Delete board"
                    onClick={() => setBoardToDelete(board)}
                    className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg border border-transparent bg-transparent text-[#89958d] transition-colors hover:border-[#f1d4d1] hover:bg-[#fff7f6] hover:text-[#a43d35] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#a43d35]"
                  >
                    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3.5 5.5h13M8 5.5V3.75h4V5.5m-6.75 0 .65 10.75h8.2l.65-10.75M8.25 8.25v5.25m3.5-5.25v5.25" />
                    </svg>
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      {boardToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center overflow-y-auto bg-[#17231f]/45 p-4 backdrop-blur-sm">
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-board-title"
            aria-describedby="delete-board-description"
            className="my-auto w-full max-w-md rounded-2xl border border-[#e7ece8] bg-white p-6 shadow-[0_24px_80px_rgba(17,39,26,0.22)] max-[520px]:p-5"
          >
            <div className="mb-5 flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff0ee] text-lg text-[#b64036]" aria-hidden="true">
                !
              </span>
              <div>
                <h2 id="delete-board-title" className="m-0 text-lg font-bold tracking-[-0.4px] text-[#17231f]">
                  Delete “{boardToDelete.name}”?
                </h2>
                <p id="delete-board-description" className="mt-2 mb-0 text-sm leading-6 text-[#68766d]">
                  This will permanently delete the board and all of its columns and tasks.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-[#edf1ed] pt-4">
              <button
                type="button"
                onClick={() => setBoardToDelete(null)}
                className="h-10 rounded-lg border border-[#dfe7e1] bg-white px-4 text-sm font-semibold text-[#526158] transition-colors hover:bg-[#f6f8f6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#438c61]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => handleDeleteBoard(boardToDelete.id)}
                className="h-10 rounded-lg border-0 bg-[#b64036] px-4 text-sm font-bold text-white transition-colors hover:bg-[#9e342c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b64036] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Delete board"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
