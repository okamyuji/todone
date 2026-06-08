import { createContext } from 'react';
import type {
  Task,
  TaskAction,
  FilterState,
  Category,
  CompletionFilter,
  SortOrder,
} from '../types/task';

export type TaskContextValue = {
  tasks: Task[];
  dispatch: (action: TaskAction) => void;
  filterState: FilterState;
  setCategories: (categories: Category[]) => void;
  setCompletionFilter: (filter: CompletionFilter) => void;
  setSortOrder: (order: SortOrder) => void;
};

export const TaskContext = createContext<TaskContextValue | null>(null);
