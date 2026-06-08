import { useCallback, useReducer, useState } from 'react';
import type { ReactNode } from 'react';
import type {
  TaskAction,
  FilterState,
  Category,
  CompletionFilter,
  SortOrder,
} from '../types/task';
import { taskReducer } from '../lib/taskReducer';
import { loadTasks, saveTasks } from '../lib/storage';
import { TaskContext } from './taskContextDef';

const DEFAULT_FILTER: FilterState = {
  categories: [],
  completionFilter: 'all',
  sortOrder: 'priority',
};

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, dispatch] = useReducer(taskReducer, [], loadTasks);
  const [filterState, setFilterState] = useState<FilterState>(DEFAULT_FILTER);

  const dispatchAndPersist = useCallback(
    (action: TaskAction) => {
      const newState = taskReducer(tasks, action);
      dispatch(action);
      saveTasks(newState);
    },
    [tasks],
  );

  const setCategories = useCallback((categories: Category[]) => {
    setFilterState((prev) => ({ ...prev, categories }));
  }, []);

  const setCompletionFilter = useCallback(
    (completionFilter: CompletionFilter) => {
      setFilterState((prev) => ({ ...prev, completionFilter }));
    },
    [],
  );

  const setSortOrder = useCallback((sortOrder: SortOrder) => {
    setFilterState((prev) => ({ ...prev, sortOrder }));
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        dispatch: dispatchAndPersist,
        filterState,
        setCategories,
        setCompletionFilter,
        setSortOrder,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
