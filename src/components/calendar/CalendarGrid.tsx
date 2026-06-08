import { memo } from 'react';
import { getDaysInMonth, getFirstDayOfMonth } from '../../lib/dateUtils';
import styles from './CalendarGrid.module.css';

interface CalendarGridProps {
  year: number;
  month: number;
  taskDates: Set<string>;
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

const DAY_HEADERS = ['日', '月', '火', '水', '木', '金', '土'];

export const CalendarGrid = memo(function CalendarGrid({
  year,
  month,
  taskDates,
  selectedDate,
  onDateSelect,
}: CalendarGridProps) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d);
  }

  return (
    <div className={styles.grid} role="grid" aria-label={`${year}年${month}月`}>
      <div className={styles.headerRow}>
        {DAY_HEADERS.map((day) => (
          <div key={day} className={styles.headerCell} role="columnheader">
            {day}
          </div>
        ))}
      </div>
      <div className={styles.body}>
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className={styles.cell} />;
          }
          const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const hasTask = taskDates.has(dateStr);
          const isSelected = dateStr === selectedDate;

          return (
            <button
              key={dateStr}
              className={`${styles.cell} ${styles.dayBtn} ${isSelected ? styles.selected : ''}`}
              onClick={() => onDateSelect(dateStr)}
              aria-label={`${month}月${day}日${hasTask ? '（タスクあり）' : ''}`}
              type="button"
            >
              <span className={styles.dayNumber}>{day}</span>
              {hasTask && <span className={styles.dot} />}
            </button>
          );
        })}
      </div>
    </div>
  );
});
