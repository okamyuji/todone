import type { Task, TaskAction } from '../types/task';

export function taskReducer(state: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case 'ADD_TASK': {
      const now = new Date().toISOString();
      const newTask: Task = {
        ...action.payload,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      };
      return [...state, newTask];
    }
    case 'UPDATE_TASK': {
      return state.map((task) =>
        task.id === action.payload.id
          ? {
              ...task,
              ...action.payload.updates,
              updatedAt: new Date().toISOString(),
            }
          : task,
      );
    }
    case 'DELETE_TASK': {
      return state.filter((task) => task.id !== action.payload);
    }
    case 'TOGGLE_COMPLETE': {
      return state.map((task) =>
        task.id === action.payload
          ? {
              ...task,
              completed: !task.completed,
              updatedAt: new Date().toISOString(),
            }
          : task,
      );
    }
    case 'LOAD_TASKS': {
      return action.payload;
    }
  }
}
