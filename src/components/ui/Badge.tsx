import { memo } from 'react';
import type { Category } from '../../types/task';
import { CATEGORIES } from '../../lib/constants';
import styles from './Badge.module.css';

interface BadgeProps {
  category: Category;
}

export const Badge = memo(function Badge({ category }: BadgeProps) {
  const info = CATEGORIES.find((c) => c.id === category);
  if (!info) return null;

  return (
    <span className={styles.badge} style={{ color: info.color }}>
      {info.label}
    </span>
  );
});
