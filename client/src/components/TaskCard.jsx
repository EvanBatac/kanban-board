export default function TaskCard({ task, onDelete }) {
  return (
    <div>
      <p>{task.title}</p>
      <button type="button" onClick={() => onDelete(task.id)}>
        Delete
      </button>
    </div>
  );
}
