import { memo } from 'react';
import type { Task } from '../../types/task';
import { Badge } from '../ui/Badge';
import { PriorityDot } from '../ui/PriorityDot';
import styles from './TaskItem.module.css';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
}

export const TaskItem = memo(function TaskItem({
  task,
  onToggle,
  onEdit,
}: TaskItemProps) {
  return (
    <div
      className={`${styles.item} ${task.completed ? styles.completed : ''}`}
      data-testid={`task-item-${task.id}`}
    >
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          aria-label={`${task.title}を${task.completed ? '未完了にする' : '完了にする'}`}
        />
        <span className={styles.checkmark} />
      </label>
      <button
        className={styles.content}
        onClick={() => onEdit(task)}
        type="button"
        aria-label={`${task.title}を編集`}
      >
        <span className={styles.title}>{task.title}</span>
        <Badge category={task.category} />
      </button>
      <PriorityDot priority={task.priority} />
    </div>
  );
});
