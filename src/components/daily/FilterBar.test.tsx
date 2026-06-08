import { describe, it, expect, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterBar } from './FilterBar';
import type { Category } from '../../types/task';

describe('FilterBar', () => {
  const defaultProps = {
    selectedCategories: [] as Category[],
    completionFilter: 'all' as const,
    sortOrder: 'priority' as const,
    onToggleCategory: vi.fn(),
    onCompletionChange: vi.fn(),
    onSortChange: vi.fn(),
  };

  it('renders category chips', () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByRole('button', { name: '仕事' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '買い物' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '勉強' })).toBeInTheDocument();
  });

  it('calls onToggleCategory when chip is clicked', async () => {
    const onToggleCategory = vi.fn();
    render(<FilterBar {...defaultProps} onToggleCategory={onToggleCategory} />);
    await userEvent.click(screen.getByRole('button', { name: '仕事' }));
    expect(onToggleCategory).toHaveBeenCalledWith('work');
  });

  it('marks active categories with aria-pressed', () => {
    render(
      <FilterBar
        {...defaultProps}
        selectedCategories={['work'] as Category[]}
      />,
    );
    const workChip = screen.getByRole('button', { name: /仕事/ });
    expect(workChip).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls onCompletionChange when completion filter changes', async () => {
    const onCompletionChange = vi.fn();
    render(
      <FilterBar {...defaultProps} onCompletionChange={onCompletionChange} />,
    );
    const select = screen.getByRole('combobox', { name: '完了フィルタ' });
    await userEvent.selectOptions(select, '未完了のみ');
    expect(onCompletionChange).toHaveBeenCalledWith('incomplete');
  });

  it('calls onSortChange when sort order changes', async () => {
    const onSortChange = vi.fn();
    render(<FilterBar {...defaultProps} onSortChange={onSortChange} />);
    const select = screen.getByRole('combobox', { name: 'ソート順' });
    await userEvent.selectOptions(select, '名前順');
    expect(onSortChange).toHaveBeenCalledWith('name');
  });
});
