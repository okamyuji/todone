import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TaskList } from './TaskList';
import type { Task } from '../../types/task';

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'タスク1',
    category: 'work',
    priority: 'high',
    date: '2026-06-19',
    completed: false,
    createdAt: '2026-06-19T00:00:00Z',
    updatedAt: '2026-06-19T00:00:00Z',
  },
  {
    id: '2',
    title: 'タスク2',
    category: 'study',
    priority: 'low',
    date: '2026-06-19',
    completed: true,
    createdAt: '2026-06-19T01:00:00Z',
    updatedAt: '2026-06-19T01:00:00Z',
  },
];

describe('TaskList', () => {
  it('renders all tasks', () => {
    render(<TaskList tasks={mockTasks} onToggle={vi.fn()} onEdit={vi.fn()} />);
    expect(screen.getByText('タスク1')).toBeInTheDocument();
    expect(screen.getByText('タスク2')).toBeInTheDocument();
  });

  it('shows empty state when no tasks', () => {
    render(<TaskList tasks={[]} onToggle={vi.fn()} onEdit={vi.fn()} />);
    expect(screen.getByText('タスクがありません')).toBeInTheDocument();
  });

  it('has proper list role', () => {
    render(<TaskList tasks={mockTasks} onToggle={vi.fn()} onEdit={vi.fn()} />);
    expect(
      screen.getByRole('list', { name: 'タスク一覧' }),
    ).toBeInTheDocument();
  });
});
