import { formatDateRange } from "@/src/core/utils/dateUtils";
import { DateFilterType } from "../home.model";

/**
 * Formats a date to ISO string with time component (e.g., 2026-03-05T00:00:00.000Z)
 */
const formatDateTimeString = (date: Date): string => {
  return date.toISOString();
};

/**
 * Calculates the date range for predefined filter types
 * Returns ISO format strings with time component for API consumption
 */
export const getDateRangeForFilter = (filterType: DateFilterType): {
  dateFrom: string;
  dateTo: string;
} => {
  const today = new Date();
  const startOfToday = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0));
  const endOfToday = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 0));

  switch (filterType) {
    case 'today':
      return {
        dateFrom: formatDateTimeString(startOfToday),
        dateTo: formatDateTimeString(endOfToday)
      };

    case 'yesterday': {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const startOfYesterday = new Date(Date.UTC(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0, 0));
      const endOfYesterday = new Date(Date.UTC(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59, 0));
      return {
        dateFrom: formatDateTimeString(startOfYesterday),
        dateTo: formatDateTimeString(endOfYesterday)
      };
    }

    case '7days': {
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 6);
      const startOfSevenDaysAgo = new Date(Date.UTC(sevenDaysAgo.getFullYear(), sevenDaysAgo.getMonth(), sevenDaysAgo.getDate(), 0, 0, 0, 0));
      return {
        dateFrom: formatDateTimeString(startOfSevenDaysAgo),
        dateTo: formatDateTimeString(endOfToday)
      };
    }

    case '30days': {
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 29);
      const startOfThirtyDaysAgo = new Date(Date.UTC(thirtyDaysAgo.getFullYear(), thirtyDaysAgo.getMonth(), thirtyDaysAgo.getDate(), 0, 0, 0, 0));
      return {
        dateFrom: formatDateTimeString(startOfThirtyDaysAgo),
        dateTo: formatDateTimeString(endOfToday)
      };
    }

    default:
      return { dateFrom: '', dateTo: '' };
  }
};

/**
 * Returns the display text for the current date filter
 */
export const getDateFilterDisplayText = (
  filterType: DateFilterType,
  customFrom?: Date,
  customTo?: Date,
  t?: any
): string => {
  switch (filterType) {
    case 'today':
      return t?.('Today') || 'Today';

    case 'yesterday':
      return t?.('Yesterday') || 'Yesterday';

    case '7days':
      return t?.('Last 7 Days') || 'Last 7 Days';

    case '30days':
      return t?.('Last 30 Days') || 'Last 30 Days';

    case 'custom':
      if (customFrom && customTo) {
        return formatDateRange(customFrom, customTo, t);
      }
      return t?.('Custom Range') || 'Custom Range';

    default:
      return t?.('Today') || 'Today';
  }
};
