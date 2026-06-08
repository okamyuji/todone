import { useState, useCallback } from 'react';
import type { Task, Category } from '../../types/task';
import { useTaskContext } from '../../hooks/useTaskContext';
import { useTaskFilter } from '../../hooks/useTaskFilter';
import { getToday, addDays } from '../../lib/dateUtils';
import { DailyHeader } from './DailyHeader';
import { FilterBar } from './FilterBar';
import { TaskList } from '../task/TaskList';
import { TaskModal } from '../task/TaskModal';
import { FAB } from '../ui/FAB';
import styles from './DailyScreen.module.css';

interface DailyScreenProps {
  initialDate?: string;
}

export function DailyScreen({ initialDate }: DailyScreenProps) {
  const {
    tasks,
    dispatch,
    filterState,
    setCategories,
    setCompletionFilter,
    setSortOrder,
  } = useTaskContext();

  const [selectedDate, setSelectedDate] = useState(initialDate ?? getToday());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const filteredTasks = useTaskFilter(tasks, filterState, selectedDate);
  const dateTasks = tasks.filter((t) => t.date === selectedDate);
  const completedCount = dateTasks.filter((t) => t.completed).length;

  const handlePrevDay = useCallback(() => {
    setSelectedDate((d) => addDays(d, -1));
  }, []);

  const handleNextDay = useCallback(() => {
    setSelectedDate((d) => addDays(d, 1));
  }, []);

  const handleToggle = useCallback(
    (id: string) => {
      dispatch({ type: 'TOGGLE_COMPLETE', payload: id });
    },
    [dispatch],
  );

  const handleEdit = useCallback((task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  }, []);

  const handleAddNew = useCallback(() => {
    setEditingTask(null);
    setModalOpen(true);
  }, []);

  const handleSave = useCallback(
    (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
      dispatch({ type: 'ADD_TASK', payload: data });
    },
    [dispatch],
  );

  const handleUpdate = useCallback(
    (id: string, updates: Partial<Task>) => {
      dispatch({ type: 'UPDATE_TASK', payload: { id, updates } });
    },
    [dispatch],
  );

  const handleDelete = useCallback(
    (id: string) => {
      dispatch({ type: 'DELETE_TASK', payload: id });
    },
    [dispatch],
  );

  const handleToggleCategory = useCallback(
    (category: Category) => {
      const current = filterState.categories;
      const next = current.includes(category)
        ? current.filter((c) => c !== category)
        : [...current, category];
      setCategories(next);
    },
    [filterState.categories, setCategories],
  );

  return (
    <div className={styles.screen}>
      <DailyHeader
        selectedDate={selectedDate}
        totalTasks={dateTasks.length}
        completedTasks={completedCount}
        onPrevDay={handlePrevDay}
        onNextDay={handleNextDay}
      />
      <FilterBar
        selectedCategories={filterState.categories}
        completionFilter={filterState.completionFilter}
        sortOrder={filterState.sortOrder}
        onToggleCategory={handleToggleCategory}
        onCompletionChange={setCompletionFilter}
        onSortChange={setSortOrder}
      />
      <TaskList
        tasks={filteredTasks}
        onToggle={handleToggle}
        onEdit={handleEdit}
      />
      <FAB onClick={handleAddNew} />
      <TaskModal
        open={modalOpen}
        task={editingTask}
        defaultDate={selectedDate}
        onSave={handleSave}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
