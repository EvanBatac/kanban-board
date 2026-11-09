export default function TaskModal({ task, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17231f]/40 p-4 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
        className="w-full max-w-lg rounded-2xl border border-[#e7ece8] bg-white p-6 shadow-[0_24px_80px_rgba(17,39,26,0.22)]"
      >
        <h2
          id="task-modal-title"
          className="m-0 text-xl font-bold tracking-[-0.5px] text-[#17231f]"
        >
          {task.title}
        </h2>
        <div className="mt-7 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border-0 bg-[#287449] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#20653e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#438c61]"
          >
            Close
          </button>
        </div>
      </section>
    </div>
  );
}
