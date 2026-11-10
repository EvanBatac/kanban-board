import { useEffect, useState } from "react";
import api from "../api/client";
import { useParams } from "react-router-dom";

export default function TaskModal({ task, onClose, onSave, members }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [dueDate, setDueDate] = useState(
    task.due_date ? task.due_date.slice(0, 10) : "",
  );
  const [assignedTo, setAssignedTo] = useState(task.assigned_to || "");
  const [error, setError] = useState("");
  const [comments, setComments] = useState([]);
  const [loadCommentsError, setLoadCommentsError] = useState("");

  const [commentText, setCommentText] = useState("");
  const [postCommentError, setPostCommentError] = useState("");

  const { id } = useParams();

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    async function loadComments() {
      setLoadCommentsError("");
      try {
        const res = await api.get(`/boards/${id}/tasks/${task.id}/comments`);
        setComments(res.data?.data?.comments);
      } catch (err) {
        setLoadCommentsError(
          err.response?.data?.message || "Could not load comments",
        );
      }
    }
    loadComments();
  }, [id, task.id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await onSave(task.id, {
        title,
        description,
        due_date: dueDate || null,
        assigned_to: assignedTo ? Number(assignedTo) : null,
      });

      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  }

  async function handleCreateComment(e) {
    e.preventDefault();
    setPostCommentError("");
    try {
      const res = await api.post(`/boards/${id}/tasks/${task.id}/comments`, {
        content: commentText,
      });

      setComments((prev) => [...prev, res.data?.data?.comment]);
      setCommentText("");
    } catch (err) {
      setPostCommentError(err.response?.data?.message || "Something went wrong");
    }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#17231f]/45 p-4 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
        className="my-auto w-full max-w-xl rounded-2xl border border-[#e7ece8] bg-white p-6 shadow-[0_24px_80px_rgba(17,39,26,0.22)] max-[520px]:p-5"
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-6 flex items-start justify-between gap-4 border-b border-[#edf1ed] pb-5">
            <div className="min-w-0 flex-1">
              <p className="mb-2 text-[10px] font-extrabold tracking-[1.5px] text-[#438c61]">
                TASK DETAILS
              </p>

              <label htmlFor="task-modal-title" className="sr-only">
                Task title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                id="task-modal-title"
                required
                className="w-full rounded-lg border border-transparent bg-transparent px-2 py-1 text-2xl font-bold tracking-[-0.7px] text-[#17231f] outline-none transition placeholder:text-[#a1aaa4] hover:border-[#e7ece8] focus:border-[#63a57a] focus:bg-white focus:shadow-[0_0_0_3px_rgba(76,151,99,0.13)] max-[520px]:text-xl"
              />
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close task details"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-0 bg-[#f4f7f4] text-xl leading-none text-[#77827b] transition-colors hover:bg-[#eaf3ec] hover:text-[#287449] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#438c61]"
            >
              ×
            </button>
          </div>

          <div className="mt-5">
            <label
              htmlFor="task-description"
              className="mb-2 block text-[11px] font-bold uppercase tracking-[1px] text-[#77827b]"
            >
              Description
            </label>

            <textarea
              id="task-description"
              name="description"
              rows="4"
              placeholder="Enter task description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-y rounded-xl border border-[#e7ece8] bg-[#fbfcfb] px-3.5 py-3 text-[13px] leading-5 text-[#35433a] outline-none transition placeholder:text-[#a1aaa4] focus:border-[#63a57a] focus:bg-white focus:shadow-[0_0_0_3px_rgba(76,151,99,0.13)]"
            />
          </div>

          <div className="mt-5">
            <label
              htmlFor="task-due-date"
              className="mb-2 block text-[11px] font-bold uppercase tracking-[1px] text-[#77827b]"
            >
              Due date
            </label>

            <input
              id="task-due-date"
              name="due_date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="h-11 w-full rounded-xl border border-[#e7ece8] bg-[#fbfcfb] px-3.5 text-[13px] text-[#35433a] outline-none transition focus:border-[#63a57a] focus:bg-white focus:shadow-[0_0_0_3px_rgba(76,151,99,0.13)]"
            />
          </div>

          <div className="mt-5">
            <label
              htmlFor="task-assignee"
              className="mb-2 block text-[11px] font-bold uppercase tracking-[1px] text-[#77827b]"
            >
              Assignee
            </label>

            <select
              id="task-assignee"
              name="assignedTo"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="h-11 w-full rounded-xl border border-[#e7ece8] bg-[#fbfcfb] px-3.5 text-[13px] text-[#35433a] outline-none transition focus:border-[#63a57a] focus:bg-white focus:shadow-[0_0_0_3px_rgba(76,151,99,0.13)]"
            >
              <option value="">Unassigned</option>

              {members.map((member) => (
                <option key={member.user_id} value={member.user_id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p
              className="mt-5 rounded-lg border border-[#f1d4d1] bg-[#fff7f6] px-4 py-3 text-sm text-[#a43d35]"
              role="alert"
            >
              {error}
            </p>
          )}

          <div className="mt-7 flex justify-end gap-2 border-t border-[#edf1ed] pt-5 max-[400px]:flex-col-reverse">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-lg border border-[#e1e8e2] bg-white px-4 text-[13px] font-bold text-[#536259] transition-colors hover:bg-[#f7f9f7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#438c61] max-[400px]:w-full"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="h-11 rounded-lg border-0 bg-[#287449] px-5 text-[13px] font-bold text-white shadow-[0_4px_10px_rgba(40,116,73,0.18)] transition-colors hover:bg-[#20653e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#438c61] max-[400px]:w-full"
            >
              Save changes
            </button>
          </div>
        </form>

        <div className="mt-6 border-t border-[#edf1ed] pt-5">
          <h3 className="text-sm font-bold text-[#293a30]">Comments</h3>

          {loadCommentsError ? (
            <p>{loadCommentsError}</p>
          ) : comments.length === 0 ? (
            <p>No comments yet</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id}>
                <span>{comment.user_name}</span>
                <p>{comment.content}</p>
              </div>
            ))
          )}

          <form onSubmit={handleCreateComment}>
            <input
              type="text"
              value={commentText}
              placeholder="Write a comment..."
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button type="submit">Post</button>
          </form>
          {postCommentError && <p>{postCommentError}</p>}
        </div>
      </section>
    </div>
  );
}
