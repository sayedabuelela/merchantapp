import { formatDateRange, formatDateString } from "@/src/core/utils/dateUtils";
import { DateFilterType } from "../home.model";

/**
 * Calculates the date range for predefined filter types
 * Returns ISO format strings (YYYY-MM-DD) for API consumption
 */
export const getDateRangeForFilter = (filterType: DateFilterType): {
  dateFrom: string;
  dateTo: string;
} => {
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
  const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

  switch (filterType) {
    case 'today':
      return {
        dateFrom: formatDateString(startOfToday),
        dateTo: formatDateString(endOfToday)
      };

    case 'yesterday': {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const startOfYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0, 0);
      const endOfYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59, 999);
      return {
        dateFrom: formatDateString(startOfYesterday),
        dateTo: formatDateString(endOfYesterday)
      };
    }

    case '7days': {
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 6); // -6 because today counts as day 1
      const startOfSevenDaysAgo = new Date(sevenDaysAgo.getFullYear(), sevenDaysAgo.getMonth(), sevenDaysAgo.getDate(), 0, 0, 0, 0);
      return {
        dateFrom: formatDateString(startOfSevenDaysAgo),
        dateTo: formatDateString(endOfToday)
      };
    }

    case '30days': {
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 29); // -29 because today counts as day 1
      const startOfThirtyDaysAgo = new Date(thirtyDaysAgo.getFullYear(), thirtyDaysAgo.getMonth(), thirtyDaysAgo.getDate(), 0, 0, 0, 0);
      return {
        dateFrom: formatDateString(startOfThirtyDaysAgo),
        dateTo: formatDateString(endOfToday)
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
