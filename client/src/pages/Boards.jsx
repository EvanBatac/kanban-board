import { useEffect, useState } from "react";
import api from "../api/client";

export default function Boards() {
  const [boards, setBoards] = useState([]);
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

  return (
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
  );
}
