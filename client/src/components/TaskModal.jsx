import { useState } from "react";

export default function TaskModal({ task, onClose, onSave, members }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [dueDate, setDueDate] = useState(
    task.due_date ? task.due_date.slice(0, 10) : "",
  );
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await onSave(task.id, { title, description, due_date: dueDate || null });

      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17231f]/40 p-4 backdrop-blur-sm">
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="task-modal-title"
          className="w-full max-w-lg rounded-2xl border border-[#e7ece8] bg-white p-6 shadow-[0_24px_80px_rgba(17,39,26,0.22)]"
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            id="task-modal-title"
            className="m-0 text-xl font-bold tracking-[-0.5px] text-[#17231f]"
          />

          <div className="mt-4">
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#89968d]">
              Description
            </h3>
            <textarea
              name="description"
              rows="5"
              placeholder="Enter task description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="mt-4">
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#89968d]">
              Due date
            </h3>
            <input
              name="due_date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="mt-4">
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#89968d]">
              Assignee
            </h3>
            <p className="mt-1 text-sm text-[#35433a]">
              {task.assignee_name || "Unassigned"}
            </p>
          </div>

          <div className="mt-7 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border-0 bg-[#287449] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#20653e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#438c61]"
            >
              Close
            </button>
            <button type="submit">Save</button>
          </div>
          {error && <p>{error}</p>}
        </section>
      </div>
    </form>
  );
}
