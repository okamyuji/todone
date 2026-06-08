import { useMemo } from 'react';
import type { Task, FilterState } from '../types/task';
import { PRIORITIES } from '../lib/constants';

export function useTaskFilter(
  tasks: Task[],
  filterState: FilterState,
  selectedDate: string,
): Task[] {
  return useMemo(() => {
    let filtered = tasks.filter((task) => task.date === selectedDate);

    if (filterState.categories.length > 0) {
      filtered = filtered.filter((task) =>
        filterState.categories.includes(task.category),
      );
    }

    if (filterState.completionFilter === 'incomplete') {
      filtered = filtered.filter((task) => !task.completed);
    } else if (filterState.completionFilter === 'complete') {
      filtered = filtered.filter((task) => task.completed);
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (filterState.sortOrder) {
        case 'priority': {
          const aOrder =
            PRIORITIES.find((p) => p.id === a.priority)?.sortOrder ?? 2;
          const bOrder =
            PRIORITIES.find((p) => p.id === b.priority)?.sortOrder ?? 2;
          return aOrder - bOrder;
        }
        case 'created':
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case 'name':
          return a.title.localeCompare(b.title, 'ja');
      }
    });

    return sorted;
  }, [tasks, filterState, selectedDate]);
}
