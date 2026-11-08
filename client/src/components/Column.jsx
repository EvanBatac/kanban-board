import TaskCard from "./TaskCard";

export default function Column({
  column,
  tasks,
  title,
  onTitleChange,
  onCreateTask,
  onDeleteTask,
}) {
  return (
    <div>
      <h2>{column.name}</h2>
      <form onSubmit={(e) => onCreateTask(e, column.id)}>
        <input
          type="text"
          value={title}
          placeholder="Enter new task..."
          onChange={(e) => onTitleChange(column.id, e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>

      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onDelete={onDeleteTask} />
      ))}
    </div>
  );
}
