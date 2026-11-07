import { useEffect, useState } from "react";
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
    <>
      <form onSubmit={handleCreate}>
        <input
          type="text"
          value={name}
          placeholder="e.g Cooking..."
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Create board</button>
      </form>
      {createError && <p>{createError}</p>}
      <div>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <>
            <h1>Your boards</h1>

            {boards.length === 0 ? (
              <p>No boards yet.</p>
            ) : (
              <ul>
                {boards.map((board) => (
                  <li key={board.id}>{board.name}</li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </>
  );
}
