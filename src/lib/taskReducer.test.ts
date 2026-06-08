import { describe, it, expect, vi, beforeEach } from 'vite-plus/test';
import { taskReducer } from './taskReducer';
import type { Task, TaskAction } from '../types/task';

describe('taskReducer', () => {
  const mockDate = '2026-06-19T10:00:00.000Z';

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(mockDate));
    vi.stubGlobal('crypto', {
      randomUUID: () => 'test-uuid-1234',
    });
  });

  const sampleTask: Task = {
    id: 'existing-1',
    title: 'Test task',
    category: 'work',
    priority: 'medium',
    date: '2026-06-19',
    completed: false,
    createdAt: '2026-06-18T09:00:00.000Z',
    updatedAt: '2026-06-18T09:00:00.000Z',
  };

  describe('ADD_TASK', () => {
    it('adds a new task with generated id and timestamps', () => {
      const action: TaskAction = {
        type: 'ADD_TASK',
        payload: {
          title: 'New task',
          category: 'work',
          priority: 'high',
          date: '2026-06-19',
          completed: false,
        },
      };
      const result = taskReducer([], action);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('test-uuid-1234');
      expect(result[0].title).toBe('New task');
      expect(result[0].createdAt).toBe(mockDate);
      expect(result[0].updatedAt).toBe(mockDate);
    });

    it('preserves existing tasks', () => {
      const action: TaskAction = {
        type: 'ADD_TASK',
        payload: {
          title: 'Another task',
          category: 'study',
          priority: 'low',
          date: '2026-06-20',
          completed: false,
        },
      };
      const result = taskReducer([sampleTask], action);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(sampleTask);
    });
  });

  describe('UPDATE_TASK', () => {
    it('updates the matching task', () => {
      const action: TaskAction = {
        type: 'UPDATE_TASK',
        payload: { id: 'existing-1', updates: { title: 'Updated title' } },
      };
      const result = taskReducer([sampleTask], action);
      expect(result[0].title).toBe('Updated title');
      expect(result[0].updatedAt).toBe(mockDate);
    });

    it('does not modify other tasks', () => {
      const otherTask: Task = { ...sampleTask, id: 'other-1', title: 'Other' };
      const action: TaskAction = {
        type: 'UPDATE_TASK',
        payload: { id: 'existing-1', updates: { title: 'Changed' } },
      };
      const result = taskReducer([sampleTask, otherTask], action);
      expect(result[1].title).toBe('Other');
    });
  });

  describe('DELETE_TASK', () => {
    it('removes the task with matching id', () => {
      const action: TaskAction = { type: 'DELETE_TASK', payload: 'existing-1' };
      const result = taskReducer([sampleTask], action);
      expect(result).toHaveLength(0);
    });

    it('keeps other tasks', () => {
      const otherTask: Task = { ...sampleTask, id: 'other-1' };
      const action: TaskAction = { type: 'DELETE_TASK', payload: 'existing-1' };
      const result = taskReducer([sampleTask, otherTask], action);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('other-1');
    });
  });

  describe('TOGGLE_COMPLETE', () => {
    it('toggles completed to true', () => {
      const action: TaskAction = {
        type: 'TOGGLE_COMPLETE',
        payload: 'existing-1',
      };
      const result = taskReducer([sampleTask], action);
      expect(result[0].completed).toBe(true);
      expect(result[0].updatedAt).toBe(mockDate);
    });

    it('toggles completed to false', () => {
      const completedTask = { ...sampleTask, completed: true };
      const action: TaskAction = {
        type: 'TOGGLE_COMPLETE',
        payload: 'existing-1',
      };
      const result = taskReducer([completedTask], action);
      expect(result[0].completed).toBe(false);
    });
  });

  describe('LOAD_TASKS', () => {
    it('replaces the entire state', () => {
      const newTasks: Task[] = [
        { ...sampleTask, id: 'new-1', title: 'Loaded task' },
      ];
      const action: TaskAction = { type: 'LOAD_TASKS', payload: newTasks };
      const result = taskReducer([sampleTask], action);
      expect(result).toEqual(newTasks);
    });
  });
});
