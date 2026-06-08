import type { Task, TaskStore } from '../types/task';
import { STORAGE_KEYS } from './constants';

export function migrateTaskStore(raw: unknown): TaskStore {
  if (raw === null || raw === undefined) {
    return { tasks: [], version: 1 };
  }

  if (typeof raw !== 'object') {
    return { tasks: [], version: 1 };
  }

  const obj = raw as Record<string, unknown>;

  if (!Array.isArray(obj.tasks)) {
    return { tasks: [], version: 1 };
  }

  if (
    obj.version !== undefined &&
    typeof obj.version === 'number' &&
    obj.version > 1
  ) {
    console.warn(
      `Unknown task store version: ${obj.version}. Attempting to load.`,
    );
  }

  const tasks: Task[] = obj.tasks
    .filter(
      (item: unknown): item is Record<string, unknown> =>
        typeof item === 'object' && item !== null,
    )
    .map((item) => ({
      id: typeof item.id === 'string' ? item.id : crypto.randomUUID(),
      title: typeof item.title === 'string' ? item.title : '',
      category:
        typeof item.category === 'string' &&
        ['work', 'shopping', 'study', 'health', 'housework', 'other'].includes(
          item.category,
        )
          ? (item.category as Task['category'])
          : 'other',
      priority:
        typeof item.priority === 'string' &&
        ['high', 'medium', 'low'].includes(item.priority)
          ? (item.priority as Task['priority'])
          : 'medium',
      date:
        typeof item.date === 'string'
          ? item.date
          : new Date().toISOString().slice(0, 10),
      completed: typeof item.completed === 'boolean' ? item.completed : false,
      createdAt:
        typeof item.createdAt === 'string'
          ? item.createdAt
          : new Date().toISOString(),
      updatedAt:
        typeof item.updatedAt === 'string'
          ? item.updatedAt
          : new Date().toISOString(),
    }));

  return { tasks, version: 1 };
}

export function saveTasks(tasks: Task[]): void {
  const store: TaskStore = { tasks, version: 1 };
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(store));
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      alert('保存容量不足。データをエクスポートしてください');
    }
  }
}

export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    const store = migrateTaskStore(parsed);
    return store.tasks;
  } catch {
    console.warn('データの読み込みに失敗。初期状態で開始します');
    return [];
  }
}

export function exportTasksToJSON(tasks: Task[]): void {
  const store: TaskStore = { tasks, version: 1 };
  const json = JSON.stringify(store, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const today = new Date().toISOString().slice(0, 10);
  const a = document.createElement('a');
  a.href = url;
  a.download = `todone-backup-${today}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importTasksFromJSON(file: File): Promise<Task[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed: unknown = JSON.parse(reader.result as string);
        const store = migrateTaskStore(parsed);
        if (
          store.tasks.length === 0 &&
          typeof parsed === 'object' &&
          parsed !== null
        ) {
          const obj = parsed as Record<string, unknown>;
          if (!Array.isArray(obj.tasks)) {
            reject(new Error('ファイルの形式が正しくありません'));
            return;
          }
        }
        resolve(store.tasks);
      } catch {
        reject(new Error('ファイルの形式が正しくありません'));
      }
    };
    reader.onerror = () =>
      reject(new Error('ファイルの読み込みに失敗しました'));
    reader.readAsText(file);
  });
}
