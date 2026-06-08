import { useState, useEffect, useRef } from 'react';
import type { Task, Category, Priority } from '../../types/task';
import { CATEGORIES, PRIORITIES, MAX_TITLE_LENGTH } from '../../lib/constants';
import styles from './TaskModal.module.css';

interface TaskModalProps {
  open: boolean;
  task: Task | null;
  defaultDate: string;
  onSave: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

function TaskModalInner({
  task,
  defaultDate,
  onSave,
  onUpdate,
  onDelete,
  onClose,
  dialogRef,
}: Omit<TaskModalProps, 'open'> & {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
}) {
  const [title, setTitle] = useState(task?.title ?? '');
  const [category, setCategory] = useState<Category>(task?.category ?? 'other');
  const [priority, setPriority] = useState<Priority>(
    task?.priority ?? 'medium',
  );
  const [date, setDate] = useState(task?.date ?? defaultDate);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
    titleInputRef.current?.focus();
  }, [dialogRef]);

  const handleSave = () => {
    const trimmed = title.trim();
    if (!trimmed) {
      setError('タスク名を入力してください');
      titleInputRef.current?.focus();
      return;
    }

    if (task) {
      onUpdate(task.id, {
        title: trimmed,
        category,
        priority,
        date,
        completed: task.completed,
      });
    } else {
      onSave({ title: trimmed, category, priority, date, completed: false });
    }
    onClose();
  };

  const handleDelete = () => {
    if (!task) return;
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }
    onDelete(task.id);
    onClose();
  };

  return (
    <>
      <h2 id="task-modal-title" className={styles.heading}>
        {task ? 'タスクを編集' : 'タスクを追加'}
      </h2>

      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <div className={styles.field}>
          <label htmlFor="task-title" className={styles.label}>
            タスク名
          </label>
          <input
            ref={titleInputRef}
            id="task-title"
            type="text"
            className={`${styles.input} ${error ? styles.inputError : ''}`}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
            maxLength={MAX_TITLE_LENGTH}
            placeholder="タスク名を入力"
          />
          <div className={styles.inputMeta}>
            {error && <span className={styles.error}>{error}</span>}
            <span className={styles.counter}>
              {title.length}/{MAX_TITLE_LENGTH}
            </span>
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="task-category" className={styles.label}>
            カテゴリ
          </label>
          <select
            id="task-category"
            className={styles.select}
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>優先度</span>
          <div
            className={styles.radioGroup}
            role="radiogroup"
            aria-label="優先度"
          >
            {PRIORITIES.map((p) => (
              <label key={p.id} className={styles.radioLabel}>
                <input
                  type="radio"
                  name="priority"
                  value={p.id}
                  checked={priority === p.id}
                  onChange={() => setPriority(p.id)}
                  className={styles.radio}
                />
                <span
                  className={styles.radioText}
                  style={{ color: priority === p.id ? p.color : undefined }}
                >
                  {p.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="task-date" className={styles.label}>
            日付
          </label>
          <input
            id="task-date"
            type="date"
            className={styles.input}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            キャンセル
          </button>
          <button type="submit" className={styles.saveBtn}>
            保存
          </button>
        </div>

        {task && (
          <div className={styles.deleteSection}>
            {showDeleteConfirm ? (
              <div className={styles.deleteConfirm}>
                <span className={styles.deleteMessage}>
                  このタスクを削除しますか？
                </span>
                <div className={styles.deleteActions}>
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    キャンセル
                  </button>
                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={handleDelete}
                  >
                    削除
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className={styles.deleteBtn}
                onClick={handleDelete}
              >
                削除
              </button>
            )}
          </div>
        )}
      </form>
    </>
  );
}

export function TaskModal({ open, onClose, ...rest }: TaskModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      onClose={onClose}
      aria-labelledby="task-modal-title"
    >
      <TaskModalInner {...rest} onClose={onClose} dialogRef={dialogRef} />
    </dialog>
  );
}
