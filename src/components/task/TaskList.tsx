import type { Task } from '../../types/task';
import { TaskItem } from './TaskItem';
import { EmptyState } from '../ui/EmptyState';
import styles from './TaskList.module.css';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
}

export function TaskList({ tasks, onToggle, onEdit }: TaskListProps) {
  if (tasks.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className={styles.list} role="list" aria-label="タスク一覧">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
