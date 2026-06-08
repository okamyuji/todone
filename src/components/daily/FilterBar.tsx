import { memo } from 'react';
import type { Category, CompletionFilter, SortOrder } from '../../types/task';
import { CATEGORIES } from '../../lib/constants';
import styles from './FilterBar.module.css';

interface FilterBarProps {
  selectedCategories: Category[];
  completionFilter: CompletionFilter;
  sortOrder: SortOrder;
  onToggleCategory: (category: Category) => void;
  onCompletionChange: (filter: CompletionFilter) => void;
  onSortChange: (order: SortOrder) => void;
}

export const FilterBar = memo(function FilterBar({
  selectedCategories,
  completionFilter,
  sortOrder,
  onToggleCategory,
  onCompletionChange,
  onSortChange,
}: FilterBarProps) {
  return (
    <div className={styles.bar} role="toolbar" aria-label="フィルタ">
      <div className={styles.chips}>
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategories.includes(cat.id);
          return (
            <button
              key={cat.id}
              className={`${styles.chip} ${isActive ? styles.chipActive : ''}`}
              onClick={() => onToggleCategory(cat.id)}
              aria-pressed={isActive}
              type="button"
            >
              {cat.label}
              {isActive && <span className={styles.checkIcon}>&#10003;</span>}
            </button>
          );
        })}
      </div>
      <div className={styles.selects}>
        <select
          className={styles.select}
          value={completionFilter}
          onChange={(e) =>
            onCompletionChange(e.target.value as CompletionFilter)
          }
          aria-label="完了フィルタ"
        >
          <option value="all">すべて</option>
          <option value="incomplete">未完了のみ</option>
          <option value="complete">完了のみ</option>
        </select>
        <select
          className={styles.select}
          value={sortOrder}
          onChange={(e) => onSortChange(e.target.value as SortOrder)}
          aria-label="ソート順"
        >
          <option value="priority">優先度順</option>
          <option value="created">作成日順</option>
          <option value="name">名前順</option>
        </select>
      </div>
    </div>
  );
});
