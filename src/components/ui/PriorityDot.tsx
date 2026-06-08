import { memo } from 'react';
import type { Priority } from '../../types/task';
import { PRIORITIES } from '../../lib/constants';
import styles from './PriorityDot.module.css';

interface PriorityDotProps {
  priority: Priority;
}

export const PriorityDot = memo(function PriorityDot({
  priority,
}: PriorityDotProps) {
  const info = PRIORITIES.find((p) => p.id === priority);
  const color = info?.color ?? '#9CA3AF';
  const label = info?.label ?? '';

  return (
    <span
      className={styles.dot}
      style={{ backgroundColor: color }}
      aria-label={`優先度: ${label}`}
      role="img"
    />
  );
});
