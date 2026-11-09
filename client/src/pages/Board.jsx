import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import api from "../api/client";
import Column from "../components/Column";

export default function Board() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [columns, setColumns] = useState([]);
  const [columnName, setColumnName] = useState("");
  const [columnError, setColumnError] = useState("");
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState({});
  const [taskError, setTaskError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  useEffect(() => {
    async function getBoardById() {
      setIsLoading(true);
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
        title: taskTitle[columnId],
      });
      setTasks((prev) => [...prev, res.data?.data?.task]);
      setTaskTitle((prev) => ({
        ...prev,
        [columnId]: "",
      }));
    } catch (err) {
      setTaskError(err.response?.data?.message || "Something went wrong");
    }
  }

  async function handleDeleteTask(taskId) {
    setTaskError("");
    try {
      await api.delete(`/boards/${id}/tasks/${taskId}`);

      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (err) {
      setTaskError(err.response?.data?.message || "Something went wrong");
    }
  }

  async function handleDragEnd(event) {
    const { active, over } = event;

    if (!over) return;

    const draggedTask = tasks.find((t) => t.id === active.id);

    if (draggedTask.column_id === over.id) return;

    const newPosition = tasks.filter((t) => t.column_id === over.id).length;

    setTaskError("");
    try {
      const res = await api.patch(`/boards/${id}/tasks/${active.id}/move`, {
        column_id: over.id,
        position: newPosition,
      });

      const updatedTask = res.data?.data?.task;

      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
      );
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
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
              <div>
                {columns.map((column) => {
                  const columnTasks = tasks.filter(
                    (task) => task.column_id === column.id,
                  );

                  return (
                    <Column
                      key={column.id}
                      column={column}
                      tasks={columnTasks}
                      title={taskTitle[column.id] || ""}
                      onTitleChange={(columnId, value) =>
                        setTaskTitle((prev) => ({
                          ...prev,
                          [columnId]: value,
                        }))
                      }
                      onCreateTask={handleCreateTask}
                      onDeleteTask={handleDeleteTask}
                    />
                  );
                })}
              </div>
            </DndContext>
          )}
        </>
      )}
      <Link to="/boards">Back</Link>
    </div>
  );
}
