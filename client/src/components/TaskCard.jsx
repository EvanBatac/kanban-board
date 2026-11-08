import { useDraggable } from "@dnd-kit/core";

export default function TaskCard({ task, onDelete }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <p>{task.title}</p>
      <button type="button" onClick={() => onDelete(task.id)}>
        Delete
      </button>
    </div>
  );
}