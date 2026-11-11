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
import TaskModal from "../components/TaskModal";

export default function Board() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [columns, setColumns] = useState([]);
  const [columnName, setColumnName] = useState("");
  const [columnError, setColumnError] = useState("");
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskTitle, setTaskTitle] = useState({});
  const [taskError, setTaskError] = useState("");
  const [members, setMembers] = useState([]);
  const [activity, setActivity] = useState([]);
  const [activityError, setActivityError] = useState("");
  const [isActivityLoading, setIsActivityLoading] = useState(true);
  const [activityVersion, setActivityVersion] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  useEffect(() => {
    async function getBoardById() {
      setActivity([])
      setIsActivityLoading(true)
      setIsLoading(true);
      setError("");
      try {
        const boardRes = await api.get(`/boards/${id}`);
        const columnRes = await api.get(`/boards/${id}/columns`);
        const taskRes = await api.get(`/boards/${id}/tasks`);
        const memberRes = await api.get(`/boards/${id}/members`);

        setBoard(boardRes.data?.data?.board);
        setColumns(columnRes.data?.data?.columns);
        setTasks(taskRes.data?.data?.tasks);
        setMembers(memberRes.data?.data?.members);
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    }
    getBoardById();
  }, [id]);

  useEffect(() => {
    async function loadActivity() {
      setActivityError("");
      try {
        const res = await api.get(`/boards/${id}/activity`);
        setActivity(res.data?.data?.activity);
      } catch (err) {
        setActivityError(
          err.response?.data?.message || "Could not load activity",
        );
      } finally {
        setIsActivityLoading(false);
      }
    }
    loadActivity();
  }, [id, activityVersion]);

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
      setActivityVersion((v) => v + 1);
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
      setActivityVersion((v) => v + 1);
    } catch (err) {
      setTaskError(err.response?.data?.message || "Something went wrong");
    }
  }

  async function handleDragEnd(event) {
    const { active, over } = event;

    if (!over) return;

    const targetColumnId = over.data.current.columnId;
    const overTaskId = over.data.current.taskId;

    const draggedTask = tasks.find((t) => t.id === active.id);

    // Don't drop a task onto itself
    if (overTaskId === active.id) return;

    // Don't move to empty space in the same column
    if (draggedTask.column_id === targetColumnId && !overTaskId) return;

    // Determine the new position
    let newPosition;

    if (overTaskId) {
      const targetTask = tasks.find((t) => t.id === overTaskId);
      newPosition = targetTask.position;
    } else {
      newPosition = tasks.filter((t) => t.column_id === targetColumnId).length;
    }

    setTaskError("");

    try {
      await api.patch(`/boards/${id}/tasks/${active.id}/move`, {
        column_id: targetColumnId,
        position: newPosition,
      });

      const res = await api.get(`/boards/${id}/tasks`);

      setTasks(res.data?.data?.tasks);
      setActivityVersion((v) => v + 1);
    } catch (err) {
      setTaskError(err.response?.data?.message || "Something went wrong");
    }
  }

  async function handleUpdateTask(taskId, fields) {
    const res = await api.patch(`/boards/${id}/tasks/${taskId}`, fields);

    const updatedTask = res.data?.data?.task;

    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
    );
    setActivityVersion((v) => v + 1);
  }
  return (
    <main className="min-h-[calc(100vh-68px)] overflow-hidden bg-[radial-gradient(ellipse_at_50%_0%,#eaf3ec_0%,transparent_42%),#f4f7f4] px-6 py-10 max-[520px]:px-4 max-[520px]:py-7">
      {isLoading ? (
        <div className="mx-auto max-w-6xl rounded-2xl border border-[#e7ece8] bg-white/80 px-6 py-14 text-center text-sm text-[#77827b]">
          Loading board…
        </div>
      ) : error ? (
        <div className="mx-auto max-w-6xl">
          <Link
            to="/boards"
            className="mb-4 inline-flex items-center gap-2 text-xs font-bold text-[#668071] no-underline transition-colors hover:text-[#287449]"
          >
            ← All boards
          </Link>
          <div
            className="rounded-2xl border border-[#f1d4d1] bg-[#fff7f6] px-6 py-10 text-center text-sm text-[#a43d35]"
            role="alert"
          >
            {error}
          </div>
        </div>
      ) : (
        <>
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex items-end justify-between gap-6 max-[700px]:flex-col max-[700px]:items-stretch">
              <div>
                <Link
                  to="/boards"
                  className="mb-4 inline-flex items-center gap-2 text-xs font-bold text-[#668071] no-underline transition-colors hover:text-[#287449]"
                >
                  ← All boards
                </Link>
                <p className="mb-2 text-[10px] font-extrabold tracking-[1.5px] text-[#438c61]">
                  PROJECT BOARD
                </p>
                <h1 className="m-0 text-[clamp(28px,5vw,36px)] leading-tight font-bold tracking-[-1.3px] text-[#17231f]">
                  {board?.name}
                </h1>
                <p className="mt-2 mb-0 text-sm text-[#77827b]">
                  Plan, track, and move work across your team.
                </p>
              </div>
              <form
                onSubmit={handleCreateColumn}
                className="flex w-full max-w-md gap-2 rounded-xl border border-[#e7ece8] bg-white p-2 shadow-[0_8px_24px_rgba(27,54,40,0.05)] max-[700px]:max-w-none max-[480px]:flex-col"
              >
                <input
                  type="text"
                  value={columnName}
                  placeholder="Name a new column"
                  aria-label="Column name"
                  onChange={(e) => setColumnName(e.target.value)}
                  className="h-11 min-w-0 flex-1 rounded-lg border border-transparent bg-[#fbfcfb] px-3.5 text-[13px] text-[#1d2a22] outline-none transition placeholder:text-[#a1aaa4] focus:border-[#63a57a] focus:bg-white focus:shadow-[0_0_0_3px_rgba(76,151,99,0.13)]"
                />
                <button
                  type="submit"
                  className="h-11 shrink-0 rounded-lg border-0 bg-[#287449] px-4 text-[13px] font-bold text-white transition-colors hover:bg-[#20653e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#438c61] max-[480px]:w-full"
                >
                  + Add column
                </button>
              </form>
            </div>
            {columnError && (
              <p
                className="mb-3 rounded-lg border border-[#f1d4d1] bg-[#fff7f6] px-4 py-3 text-sm text-[#a43d35]"
                role="alert"
              >
                {columnError}
              </p>
            )}
            {taskError && (
              <p
                className="mb-3 rounded-lg border border-[#f1d4d1] bg-[#fff7f6] px-4 py-3 text-sm text-[#a43d35]"
                role="alert"
              >
                {taskError}
              </p>
            )}
            {columns.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#cfdcd2] bg-[rgba(255,255,255,0.62)] px-6 py-14 text-center">
                <span
                  className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf4ed] text-2xl text-[#438c61]"
                  aria-hidden="true"
                >
                  ▤
                </span>
                <h2 className="m-0 text-base font-bold text-[#27372d]">
                  Your board is ready
                </h2>
                <p className="mt-2 mb-0 text-sm text-[#77827b]">
                  Add a column above, such as “To do”, to start organizing
                  tasks.
                </p>
              </div>
            ) : (
              <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                <div className="-mx-2 flex items-start gap-4 overflow-x-auto px-2 pb-6 pt-1">
                  {columns.map((column) => {
                    const columnTasks = tasks
                      .filter((task) => task.column_id === column.id)
                      .sort((a, b) => a.position - b.position);

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
                        onOpenTask={setSelectedTask}
                      />
                    );
                  })}
                </div>
              </DndContext>
            )}
            <section>
              <h2>Activity</h2>
              {isActivityLoading ? (
                <p>Loading activity...</p>
              ) : activityError ? (
                <p>{activityError}</p>
              ) : activity.length === 0 ? (
                <p>No activity yet.</p>
              ) : (
                <ul>
                  {activity.map((entry) => (
                    <li key={entry.id}>
                      {entry.user_name || "Someone"} {entry.details}{" "}
                      {new Date(entry.created_at).toLocaleString()}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </>
      )}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          members={members}
          onSave={handleUpdateTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </main>
  );
}
