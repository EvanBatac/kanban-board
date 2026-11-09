import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";

export default function Column({
  column,
  tasks,
  title,
  onTitleChange,
  onCreateTask,
  onDeleteTask,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column.id}`,
    data: { columnId: column.id },
  });

  return (
    <section
      ref={setNodeRef}
      aria-label={`${column.name} column`}
      className={`w-[min(310px,84vw)] shrink-0 rounded-2xl border p-3.5 transition-colors ${isOver ? "border-[#8fbea0] bg-[#edf6ef]" : "border-[#e3eae5] bg-[#eef2ef]"}`}
    >
      <div className="mb-3 flex items-center justify-between gap-3 px-1 pt-0.5">
        <h2 className="m-0 truncate text-sm font-bold tracking-[-0.2px] text-[#293a30]">
          {column.name}
        </h2>
        <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-2 text-[11px] font-bold text-[#77877c]">
          {tasks.length}
        </span>
      </div>
      <form
        onSubmit={(e) => onCreateTask(e, column.id)}
        className="mb-3 flex gap-1.5 rounded-xl border border-[#e5ebe6] bg-white p-1.5 shadow-[0_2px_7px_rgba(27,54,40,0.025)]"
      >
        <input
          type="text"
          value={title}
          placeholder="Enter new task..."
          aria-label={`New task for ${column.name}`}
          onChange={(e) => onTitleChange(column.id, e.target.value)}
          className="h-9 min-w-0 flex-1 rounded-lg border border-transparent bg-transparent px-2 text-xs text-[#293a30] outline-none placeholder:text-[#a1aaa4] focus:border-[#b8d0bf] focus:bg-[#fbfcfb]"
        />
        <button
          type="submit"
          aria-label="Add task"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-0 bg-[#eaf4ed] text-lg font-medium text-[#287449] transition-colors hover:bg-[#dceee1] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#438c61]"
        >
          +
        </button>
      </form>

      <div className="flex min-h-12 flex-col gap-2">
        {tasks.length === 0 ? (
          <p className="m-0 rounded-xl border border-dashed border-[#d5dfd8] px-3 py-4 text-center text-xs text-[#89968d]">
            Drop a task here or add one above
          </p>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} onDelete={onDeleteTask} />
          ))
        )}
      </div>
    </section>
  );
}
