import { describe, it, expect, vi, beforeAll } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';
import { TaskProvider } from '../context/TaskContext';

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = vi.fn();
  HTMLDialogElement.prototype.close = vi.fn();
});

function renderApp() {
  return render(
    <TaskProvider>
      <App />
    </TaskProvider>,
  );
}

describe('App', () => {
  it('renders the daily screen by default', () => {
    renderApp();
    expect(screen.getByRole('button', { name: '前日' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '翌日' })).toBeInTheDocument();
  });

  it('renders bottom navigation', () => {
    renderApp();
    expect(
      screen.getByRole('navigation', { name: 'メインナビゲーション' }),
    ).toBeInTheDocument();
  });

  it('switches to calendar tab', async () => {
    renderApp();
    const nav = screen.getByRole('navigation', {
      name: 'メインナビゲーション',
    });
    const calendarTab = nav.querySelector('button:nth-child(2)')!;
    await userEvent.click(calendarTab);
    expect(screen.getByText(/\d+年\d+月/)).toBeInTheDocument();
  });

  it('switches to settings tab', async () => {
    renderApp();
    const nav = screen.getByRole('navigation', {
      name: 'メインナビゲーション',
    });
    const settingsTab = nav.querySelector('button:nth-child(3)')!;
    await userEvent.click(settingsTab);
    expect(screen.getByRole('heading', { name: '設定' })).toBeInTheDocument();
    expect(screen.getByText('データ管理')).toBeInTheDocument();
  });

  it('marks active tab with aria-current', () => {
    renderApp();
    const nav = screen.getByRole('navigation', {
      name: 'メインナビゲーション',
    });
    const dailyTab = nav.querySelector('button:first-child');
    expect(dailyTab).toHaveAttribute('aria-current', 'page');
  });
});
