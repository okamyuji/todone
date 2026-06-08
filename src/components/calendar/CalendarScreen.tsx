import { useState, useMemo, useCallback } from 'react';
import { useTaskContext } from '../../hooks/useTaskContext';
import { getToday } from '../../lib/dateUtils';
import { CalendarGrid } from './CalendarGrid';
import styles from './CalendarScreen.module.css';

interface CalendarScreenProps {
  onDateSelect: (date: string) => void;
}

export function CalendarScreen({ onDateSelect }: CalendarScreenProps) {
  const { tasks } = useTaskContext();
  const today = getToday();
  const [year, setYear] = useState(() => parseInt(today.slice(0, 4), 10));
  const [month, setMonth] = useState(() => parseInt(today.slice(5, 7), 10));

  const taskDates = useMemo(() => {
    return new Set(tasks.map((t) => t.date));
  }, [tasks]);

  const handlePrevMonth = useCallback(() => {
    setMonth((m) => {
      if (m === 1) {
        setYear((y) => y - 1);
        return 12;
      }
      return m - 1;
    });
  }, []);

  const handleNextMonth = useCallback(() => {
    setMonth((m) => {
      if (m === 12) {
        setYear((y) => y + 1);
        return 1;
      }
      return m + 1;
    });
  }, []);

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <button
          className={styles.navBtn}
          onClick={handlePrevMonth}
          aria-label="前月"
          type="button"
        >
          &#9664;
        </button>
        <h2 className={styles.title}>
          {year}年{month}月
        </h2>
        <button
          className={styles.navBtn}
          onClick={handleNextMonth}
          aria-label="翌月"
          type="button"
        >
          &#9654;
        </button>
      </header>
      <CalendarGrid
        year={year}
        month={month}
        taskDates={taskDates}
        selectedDate={today}
        onDateSelect={onDateSelect}
      />
    </div>
  );
}
