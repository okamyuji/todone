import { describe, it, expect, vi, beforeEach } from 'vitest';
import { migrateTaskStore, saveTasks, loadTasks } from './storage';
import type { Task } from '../types/task';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('crypto', {
      randomUUID: () => 'fallback-uuid',
    });
  });

  describe('migrateTaskStore', () => {
    it('returns empty store for null input', () => {
      const result = migrateTaskStore(null);
      expect(result).toEqual({ tasks: [], version: 1 });
    });

    it('returns empty store for undefined input', () => {
      const result = migrateTaskStore(undefined);
      expect(result).toEqual({ tasks: [], version: 1 });
    });

    it('returns empty store for non-object input', () => {
      const result = migrateTaskStore('invalid');
      expect(result).toEqual({ tasks: [], version: 1 });
    });

    it('returns empty store when tasks is not an array', () => {
      const result = migrateTaskStore({ tasks: 'not-array' });
      expect(result).toEqual({ tasks: [], version: 1 });
    });

    it('migrates valid task data', () => {
      const input = {
        tasks: [
          {
            id: 'task-1',
            title: 'Test',
            category: 'work',
            priority: 'high',
            date: '2026-06-19',
            completed: false,
            createdAt: '2026-06-19T00:00:00Z',
            updatedAt: '2026-06-19T00:00:00Z',
          },
        ],
        version: 1,
      };
      const result = migrateTaskStore(input);
      expect(result.tasks).toHaveLength(1);
      expect(result.tasks[0].title).toBe('Test');
    });

    it('fills defaults for missing fields', () => {
      const input = {
        tasks: [{ id: 'task-1' }],
        version: 1,
      };
      const result = migrateTaskStore(input);
      expect(result.tasks[0].title).toBe('');
      expect(result.tasks[0].category).toBe('other');
      expect(result.tasks[0].priority).toBe('medium');
      expect(result.tasks[0].completed).toBe(false);
    });

    it('generates UUID for tasks with missing id', () => {
      const input = {
        tasks: [{ title: 'No ID task' }],
        version: 1,
      };
      const result = migrateTaskStore(input);
      expect(result.tasks[0].id).toBe('fallback-uuid');
    });

    it('warns for unknown version but still loads', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const input = {
        tasks: [{ id: '1', title: 'Future' }],
        version: 99,
      };
      const result = migrateTaskStore(input);
      expect(result.tasks).toHaveLength(1);
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Unknown task store version'),
      );
      warnSpy.mockRestore();
    });
  });

  describe('saveTasks', () => {
    it('saves tasks to localStorage', () => {
      const tasks: Task[] = [
        {
          id: '1',
          title: 'Saved task',
          category: 'work',
          priority: 'high',
          date: '2026-06-19',
          completed: false,
          createdAt: '2026-06-19T00:00:00Z',
          updatedAt: '2026-06-19T00:00:00Z',
        },
      ];
      saveTasks(tasks);
      const stored = localStorage.getItem('todone-tasks');
      expect(stored).not.toBeNull();
      const parsed = JSON.parse(stored!);
      expect(parsed.tasks).toHaveLength(1);
      expect(parsed.version).toBe(1);
    });
  });

  describe('loadTasks', () => {
    it('returns empty array when no data exists', () => {
      expect(loadTasks()).toEqual([]);
    });

    it('loads tasks from localStorage', () => {
      const store = {
        tasks: [
          {
            id: '1',
            title: 'Loaded',
            category: 'study',
            priority: 'low',
            date: '2026-06-19',
            completed: true,
            createdAt: '2026-06-19T00:00:00Z',
            updatedAt: '2026-06-19T00:00:00Z',
          },
        ],
        version: 1,
      };
      localStorage.setItem('todone-tasks', JSON.stringify(store));
      const result = loadTasks();
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Loaded');
    });

    it('returns empty array for invalid JSON', () => {
      localStorage.setItem('todone-tasks', 'not-json');
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const result = loadTasks();
      expect(result).toEqual([]);
      warnSpy.mockRestore();
    });
  });
});
