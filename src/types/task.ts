export type TaskId = string;

export type Category =
  | 'work'
  | 'shopping'
  | 'study'
  | 'health'
  | 'housework'
  | 'other';

export type Priority = 'high' | 'medium' | 'low';

export type Task = {
  id: TaskId;
  title: string;
  category: Category;
  priority: Priority;
  date: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TaskStore = {
  tasks: Task[];
  version: 1;
};

export type TaskAction =
  | { type: 'ADD_TASK'; payload: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_TASK'; payload: { id: TaskId; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: TaskId }
  | { type: 'TOGGLE_COMPLETE'; payload: TaskId }
  | { type: 'LOAD_TASKS'; payload: Task[] };

export type CompletionFilter = 'all' | 'incomplete' | 'complete';

export type SortOrder = 'priority' | 'created' | 'name';

export type FilterState = {
  categories: Category[];
  completionFilter: CompletionFilter;
  sortOrder: SortOrder;
};
