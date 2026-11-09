import { useDraggable, useDroppable } from "@dnd-kit/core";

export default function TaskCard({ task, onDelete, onOpen }) {
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
  } = useDraggable({
    id: task.id,
  });

  const { setNodeRef: setDropRef } = useDroppable({
    id: `task-${task.id}`,
    data: {
      columnId: task.column_id,
      taskId: task.id,
    },
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <article
      ref={(node) => {
        setDragRef(node);
        setDropRef(node);
      }}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => onOpen(task)}
      className="group flex cursor-grab items-start justify-between gap-3 rounded-xl border border-[#e7ece8] bg-white px-3.5 py-3 shadow-[0_3px_9px_rgba(27,54,40,0.04)] transition-[border-color,box-shadow,transform] hover:border-[#cbd9cf] hover:shadow-[0_7px_15px_rgba(27,54,40,0.07)] active:cursor-grabbing"
    >
      <p className="m-0 min-w-0 flex-1 whitespace-pre-wrap wrap-break-word text-[13px] leading-5 text-[#35433a]">
        {task.title}
      </p>
      <button
        type="button"
        aria-label={`Delete ${task.title}`}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation();
          onDelete(task.id);
        }}
        className="shrink-0 rounded-md border-0 bg-transparent px-1.5 py-1 text-[11px] font-semibold text-[#9aa59d] opacity-100 transition-[color,opacity,background] hover:bg-[#fff1ef] hover:text-[#a43d35] focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-[#c9635b] min-[641px]:opacity-0 min-[641px]:group-hover:opacity-100"
      >
        Delete
      </button>
    </article>
  );
}
