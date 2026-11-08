import { useParams, Link } from "react-router-dom";
import api from "../api/client";
import { useEffect, useState } from "react";

export default function Board() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [columns, setColumns] = useState([]);
  const [columnName, setColumnName] = useState("");
  const [columnError, setColumnError] = useState("");
  const [task, setTask] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    async function getBoardById() {
      setError("");
      try {
        const boardRes = await api.get(`/boards/${id}`);
        const columnRes = await api.get(`/boards/${id}/columns`);
        const taskRes = await api.get(`/boards/${id}/tasks`);

        console.log(taskRes.data);

        setBoard(boardRes.data?.data?.board);
        setColumns(columnRes.data?.data?.columns);
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    }
    getBoardById();
  }, [id]);

  async function handleCreateColumn(e) {
    e.preventDefault();
    setColumnError("");
    try {
      const res = await api.post(`/boards/${id}/columns`, { name: columnName });
      setColumns((prev) => [...prev, res.data?.data?.column]);
      setColumnName("");
    } catch (err) {
      setColumnError(err.response?.data?.message || "Something went wrong");
    }
  }
  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <h1>{board.name}</h1>
          <form onSubmit={handleCreateColumn}>
            <input
              type="text"
              value={columnName}
              placeholder="e.g blahblah"
              onChange={(e) => setColumnName(e.target.value)}
            />
            <button type="submit">Create Column</button>
          </form>
          {columnError && <p>{columnError}</p>}
          {columns.length === 0 ? (
            <p>No columns yet.</p>
          ) : (
            <div>
              {columns.map((column) => (
                <div key={column.id}>{column.name}</div>
              ))}
            </div>
          )}
        </>
      )}
      <Link to="/boards">Back</Link>
    </div>
  );
}
