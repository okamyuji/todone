import { memo } from 'react';
import { formatDateJP, getToday } from '../../lib/dateUtils';
import styles from './DailyHeader.module.css';

interface DailyHeaderProps {
  selectedDate: string;
  totalTasks: number;
  completedTasks: number;
  onPrevDay: () => void;
  onNextDay: () => void;
}

export const DailyHeader = memo(function DailyHeader({
  selectedDate,
  totalTasks,
  completedTasks,
  onPrevDay,
  onNextDay,
}: DailyHeaderProps) {
  const isToday = selectedDate === getToday();

  return (
    <header className={styles.header}>
      <div className={styles.row}>
        <h1 className={styles.date}>{formatDateJP(selectedDate)}</h1>
        <div className={styles.nav}>
          <button
            className={styles.navBtn}
            onClick={onPrevDay}
            aria-label="前日"
            type="button"
          >
            &#9664;
          </button>
          <button
            className={styles.navBtn}
            onClick={onNextDay}
            aria-label="翌日"
            type="button"
          >
            &#9654;
          </button>
        </div>
      </div>
      <p className={styles.summary}>
        {isToday ? '今日' : formatDateJP(selectedDate).slice(0, -4)} ·{' '}
        {completedTasks}件完了/{totalTasks}件
      </p>
    </header>
  );
});
