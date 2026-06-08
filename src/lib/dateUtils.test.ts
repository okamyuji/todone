import { describe, it, expect } from 'vitest';
import {
  formatDateJP,
  getToday,
  addDays,
  getDaysInMonth,
  getFirstDayOfMonth,
} from './dateUtils';

describe('dateUtils', () => {
  describe('formatDateJP', () => {
    it('formats a Friday date correctly', () => {
      // 2026-06-19 is a Friday
      expect(formatDateJP('2026-06-19')).toBe('6月19日（金）');
    });

    it('formats a Sunday date correctly', () => {
      // 2026-06-14 is a Sunday
      expect(formatDateJP('2026-06-14')).toBe('6月14日（日）');
    });

    it('formats January 1st correctly', () => {
      // 2026-01-01 is a Thursday
      expect(formatDateJP('2026-01-01')).toBe('1月1日（木）');
    });
  });

  describe('getToday', () => {
    it('returns a YYYY-MM-DD formatted string', () => {
      const today = getToday();
      expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('addDays', () => {
    it('adds days to a date', () => {
      expect(addDays('2026-06-19', 1)).toBe('2026-06-20');
    });

    it('subtracts days from a date', () => {
      expect(addDays('2026-06-19', -1)).toBe('2026-06-18');
    });

    it('handles month boundaries', () => {
      expect(addDays('2026-06-30', 1)).toBe('2026-07-01');
    });

    it('handles year boundaries', () => {
      expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    });
  });

  describe('getDaysInMonth', () => {
    it('returns 30 for June', () => {
      expect(getDaysInMonth(2026, 6)).toBe(30);
    });

    it('returns 28 for February in non-leap year', () => {
      expect(getDaysInMonth(2025, 2)).toBe(28);
    });

    it('returns 29 for February in leap year', () => {
      expect(getDaysInMonth(2024, 2)).toBe(29);
    });

    it('returns 31 for January', () => {
      expect(getDaysInMonth(2026, 1)).toBe(31);
    });
  });

  describe('getFirstDayOfMonth', () => {
    it('returns the day of week for the first day of the month', () => {
      // June 2026 starts on Monday (1)
      expect(getFirstDayOfMonth(2026, 6)).toBe(1);
    });

    it('returns 0 for months starting on Sunday', () => {
      // March 2026 starts on Sunday
      expect(getFirstDayOfMonth(2026, 3)).toBe(0);
    });
  });
});
