import { describe, it, expect, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskItem } from './TaskItem';
import type { Task } from '../../types/task';

const mockTask: Task = {
  id: 'task-1',
  title: 'テストタスク',
  category: 'work',
  priority: 'high',
  date: '2026-06-19',
  completed: false,
  createdAt: '2026-06-19T00:00:00Z',
  updatedAt: '2026-06-19T00:00:00Z',
};

describe('TaskItem', () => {
  it('renders the task title', () => {
    render(<TaskItem task={mockTask} onToggle={vi.fn()} onEdit={vi.fn()} />);
    expect(screen.getByText('テストタスク')).toBeInTheDocument();
  });

  it('renders the category badge', () => {
    render(<TaskItem task={mockTask} onToggle={vi.fn()} onEdit={vi.fn()} />);
    expect(screen.getByText('仕事')).toBeInTheDocument();
  });

  it('renders checkbox unchecked for incomplete task', () => {
    render(<TaskItem task={mockTask} onToggle={vi.fn()} onEdit={vi.fn()} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('renders checkbox checked for completed task', () => {
    const completed = { ...mockTask, completed: true };
    render(<TaskItem task={completed} onToggle={vi.fn()} onEdit={vi.fn()} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('calls onToggle when checkbox is clicked', async () => {
    const onToggle = vi.fn();
    render(<TaskItem task={mockTask} onToggle={onToggle} onEdit={vi.fn()} />);
    const checkbox = screen.getByRole('checkbox');
    await userEvent.click(checkbox);
    expect(onToggle).toHaveBeenCalledWith('task-1');
  });

  it('calls onEdit when content area is clicked', async () => {
    const onEdit = vi.fn();
    render(<TaskItem task={mockTask} onToggle={vi.fn()} onEdit={onEdit} />);
    const editBtn = screen.getByRole('button', { name: /テストタスクを編集/ });
    await userEvent.click(editBtn);
    expect(onEdit).toHaveBeenCalledWith(mockTask);
  });
});
