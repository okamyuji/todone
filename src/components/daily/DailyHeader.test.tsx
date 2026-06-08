import { describe, it, expect, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DailyHeader } from './DailyHeader';

describe('DailyHeader', () => {
  const defaultProps = {
    selectedDate: '2026-06-19',
    totalTasks: 5,
    completedTasks: 2,
    onPrevDay: vi.fn(),
    onNextDay: vi.fn(),
  };

  it('displays the formatted date', () => {
    render(<DailyHeader {...defaultProps} />);
    expect(screen.getByText('6月19日（金）')).toBeInTheDocument();
  });

  it('displays task count summary', () => {
    render(<DailyHeader {...defaultProps} />);
    expect(screen.getByText(/2件完了\/5件/)).toBeInTheDocument();
  });

  it('calls onPrevDay when prev button is clicked', async () => {
    const onPrevDay = vi.fn();
    render(<DailyHeader {...defaultProps} onPrevDay={onPrevDay} />);
    const prevBtn = screen.getByRole('button', { name: '前日' });
    await userEvent.click(prevBtn);
    expect(onPrevDay).toHaveBeenCalled();
  });

  it('calls onNextDay when next button is clicked', async () => {
    const onNextDay = vi.fn();
    render(<DailyHeader {...defaultProps} onNextDay={onNextDay} />);
    const nextBtn = screen.getByRole('button', { name: '翌日' });
    await userEvent.click(nextBtn);
    expect(onNextDay).toHaveBeenCalled();
  });
});
