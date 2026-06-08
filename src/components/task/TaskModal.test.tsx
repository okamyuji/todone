import {
  describe,
  it,
  expect,
  vi,
  beforeAll,
  beforeEach,
} from 'vite-plus/test';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskModal } from './TaskModal';
import type { Task } from '../../types/task';

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(
    function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    },
  );
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.removeAttribute('open');
  });
});

const existingTask: Task = {
  id: 'task-1',
  title: '既存タスク',
  category: 'work',
  priority: 'high',
  date: '2026-06-19',
  completed: false,
  createdAt: '2026-06-19T00:00:00Z',
  updatedAt: '2026-06-19T00:00:00Z',
};

function getDefaultProps() {
  return {
    open: true,
    task: null as Task | null,
    defaultDate: '2026-06-19',
    onSave: vi.fn(),
    onUpdate: vi.fn(),
    onDelete: vi.fn(),
    onClose: vi.fn(),
  };
}

function getDialog() {
  return screen.getByRole('dialog', { hidden: true });
}

describe('TaskModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows add title when no task', () => {
    const props = getDefaultProps();
    render(<TaskModal {...props} />);
    const dialog = getDialog();
    expect(within(dialog).getByText('タスクを追加')).toBeInTheDocument();
  });

  it('shows edit title when task provided', () => {
    const props = getDefaultProps();
    render(<TaskModal {...props} task={existingTask} />);
    const dialog = getDialog();
    expect(within(dialog).getByText('タスクを編集')).toBeInTheDocument();
  });

  it('shows validation error for empty title', async () => {
    const props = getDefaultProps();
    render(<TaskModal {...props} />);
    const dialog = getDialog();
    const saveBtn = within(dialog).getByRole('button', {
      name: '保存',
      hidden: true,
    });
    await userEvent.click(saveBtn);
    expect(
      within(dialog).getByText('タスク名を入力してください'),
    ).toBeInTheDocument();
    expect(props.onSave).not.toHaveBeenCalled();
  });

  it('calls onSave with form data for new task', async () => {
    const props = getDefaultProps();
    render(<TaskModal {...props} />);
    const dialog = getDialog();
    const input = within(dialog).getByLabelText('タスク名', { exact: false });
    await userEvent.type(input, '新しいタスク');
    const saveBtn = within(dialog).getByRole('button', {
      name: '保存',
      hidden: true,
    });
    await userEvent.click(saveBtn);
    expect(props.onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        title: '新しいタスク',
        category: 'other',
        priority: 'medium',
      }),
    );
    expect(props.onClose).toHaveBeenCalled();
  });

  it('calls onUpdate for existing task', async () => {
    const props = getDefaultProps();
    render(<TaskModal {...props} task={existingTask} />);
    const dialog = getDialog();
    const input = within(dialog).getByLabelText('タスク名', { exact: false });
    await userEvent.clear(input);
    await userEvent.type(input, '更新タスク');
    const saveBtn = within(dialog).getByRole('button', {
      name: '保存',
      hidden: true,
    });
    await userEvent.click(saveBtn);
    expect(props.onUpdate).toHaveBeenCalledWith(
      'task-1',
      expect.objectContaining({ title: '更新タスク' }),
    );
  });

  it('calls onClose when cancel is clicked', async () => {
    const props = getDefaultProps();
    render(<TaskModal {...props} />);
    const dialog = getDialog();
    const cancelBtn = within(dialog).getByRole('button', {
      name: 'キャンセル',
      hidden: true,
    });
    await userEvent.click(cancelBtn);
    expect(props.onClose).toHaveBeenCalled();
  });

  it('shows delete button only for existing task', () => {
    const props = getDefaultProps();
    const { rerender } = render(<TaskModal {...props} task={null} />);
    expect(
      screen.queryByRole('button', { name: '削除', hidden: true }),
    ).not.toBeInTheDocument();
    rerender(<TaskModal {...props} task={existingTask} />);
    const dialog = getDialog();
    expect(
      within(dialog).getByRole('button', { name: '削除', hidden: true }),
    ).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    const props = getDefaultProps();
    render(<TaskModal {...props} open={false} />);
    expect(screen.queryByText('タスクを追加')).not.toBeInTheDocument();
  });
});
