import { useParams, Link } from "react-router-dom";
import api from "../api/client";
import { useEffect, useState } from "react";

export default function Board() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [columns, setColumns] = useState([]);
  const [columnName, setColumnName] = useState("");
  const [columnError, setColumnError] = useState("");
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskError, setTaskError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    async function getBoardById() {
      setError("");
      try {
        const boardRes = await api.get(`/boards/${id}`);
        const columnRes = await api.get(`/boards/${id}/columns`);
        const taskRes = await api.get(`/boards/${id}/tasks`);

        setBoard(boardRes.data?.data?.board);
        setColumns(columnRes.data?.data?.columns);
        setTasks(taskRes.data?.data?.tasks);
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

  async function handleCreateTask(e, columnId) {
    e.preventDefault();
    setTaskError("");
    try {
      const res = await api.post(`/boards/${id}/columns/${columnId}/tasks`, {
        title: taskTitle,
      });
      console.log(res.data);
      setTaskTitle("");
    } catch (err) {
      setTaskError(err.response?.data?.message || "Something went wrong");
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
          <h1>{board?.name}</h1>
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
          {taskError && <p>{taskError}</p>}
          {columns.length === 0 ? (
            <p>No columns yet.</p>
          ) : (
            <div>
              {columns.map((column) => {
                const columnTasks = tasks.filter(
                  (task) => task.column_id === column.id,
                );

                return (
                  <div key={column.id}>
                    <h2>{column.name}</h2>
                    <form onSubmit={(e) => handleCreateTask(e, column.id)}>
                      <input
                        type="text"
                        value={taskTitle}
                        placeholder="Enter new task..."
                        onChange={(e) => setTaskTitle(e.target.value)}
                      />
                      <button type="submit">Add Task</button>
                    </form>
                    {columnTasks.map((task) => (
                      <div key={task.id}>{task.title}</div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
      <Link to="/boards">Back</Link>
    </div>
  );
}
