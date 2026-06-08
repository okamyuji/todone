import type { Category, Priority } from '../types/task';

export type CategoryInfo = {
  id: Category;
  label: string;
  color: string;
  icon: string;
};

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'work',
    label: '仕事',
    color: 'var(--color-primary)',
    icon: 'briefcase',
  },
  {
    id: 'shopping',
    label: '買い物',
    color: 'var(--color-secondary)',
    icon: 'cart',
  },
  { id: 'study', label: '勉強', color: 'var(--color-success)', icon: 'book' },
  { id: 'health', label: '健康', color: 'var(--color-warning)', icon: 'heart' },
  { id: 'housework', label: '家事', color: 'var(--color-error)', icon: 'home' },
  {
    id: 'other',
    label: 'その他',
    color: 'var(--color-text-secondary)',
    icon: 'tag',
  },
];

export type PriorityInfo = {
  id: Priority;
  label: string;
  color: string;
  sortOrder: number;
};

export const PRIORITIES: PriorityInfo[] = [
  { id: 'high', label: '高', color: '#EF4444', sortOrder: 1 },
  { id: 'medium', label: '中', color: '#F59E0B', sortOrder: 2 },
  { id: 'low', label: '低', color: '#9CA3AF', sortOrder: 3 },
];

export const STORAGE_KEYS = {
  TASKS: 'todone-tasks',
  SETTINGS: 'todone-settings',
} as const;

export const MAX_TITLE_LENGTH = 200;
