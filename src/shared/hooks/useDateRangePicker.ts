import { createDateObject, formatDateString } from '@/src/core/utils/dateUtils';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface DateObject {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
}

interface MarkedDate {
  color: string;
  textColor: string;
  startingDay?: boolean;
  endingDay?: boolean;
}

interface DateRangeData {
  from: Date | undefined;
  to: Date | undefined;
}

interface UseDateRangePickerProps {
  initialRange?: DateRangeData;
}

interface UseDateRangePickerReturn {
  startDate: DateObject | null;
  endDate: DateObject | null;
  markedDates: Record<string, MarkedDate>;
  displayText: string;
  handleDayPress: (day: DateObject) => void;
  handleClear: () => void;
  resetToSaved: (range: DateRangeData | undefined) => void;
  getDateRange: () => DateRangeData | null;
}

// Constants
const MARKING_COLORS = {
  background: '#001F5F',
  text: '#FFFFFF',
} as const;

const DAY_IN_MS = 24 * 60 * 60 * 1000;

// Utility function moved outside component
const getPeriodMarking = (startTimestamp: number, endTimestamp: number): Record<string, MarkedDate> => {
  const marking: Record<string, MarkedDate> = {};
  let currentTimestamp = startTimestamp;

  while (currentTimestamp <= endTimestamp) {
    const dateString = formatDateString(new Date(currentTimestamp));
    marking[dateString] = {
      color: MARKING_COLORS.background,
      textColor: MARKING_COLORS.text,
      startingDay: currentTimestamp === startTimestamp,
      endingDay: currentTimestamp === endTimestamp,
    };
    currentTimestamp += DAY_IN_MS;
  }

  return marking;
};

export const useDateRangePicker = ({ initialRange }: UseDateRangePickerProps = {}): UseDateRangePickerReturn => {
  const { t } = useTranslation();
  const [startDate, setStartDate] = useState<DateObject | null>(null);
  const [endDate, setEndDate] = useState<DateObject | null>(null);

  // Memoize markedDates calculation
  const markedDates = useMemo(() => {
    if (!startDate) return {};

    if (!endDate) {
      return {
        [startDate.dateString]: {
          color: MARKING_COLORS.background,
          textColor: MARKING_COLORS.text,
          startingDay: true,
          endingDay: true,
        }
      };
    }

    return getPeriodMarking(startDate.timestamp, endDate.timestamp);
  }, [startDate, endDate]);

  const handleDayPress = useCallback((day: DateObject) => {
    const newDayObj = {
      ...day,
      timestamp: new Date(day.year, day.month - 1, day.day).getTime()
    };

    if (!startDate || (startDate && endDate)) {
      setStartDate(newDayObj);
      setEndDate(null);
    } else {
      if (newDayObj.timestamp < startDate.timestamp) {
        setStartDate(newDayObj);
        setEndDate(startDate);
      } else {
        setEndDate(newDayObj);
      }
    }
  }, [startDate, endDate]);

  const handleClear = useCallback(() => {
    setStartDate(null);
    setEndDate(null);
  }, []);

  const resetToSaved = useCallback((range: DateRangeData | undefined) => {
    if (range?.from && range?.to) {
      const start = createDateObject(range.from);
      const end = createDateObject(range.to);
      setStartDate(start);
      setEndDate(end);
    } else {
      handleClear();
    }
  }, [handleClear]);

  const getDateRange = useCallback((): DateRangeData | null => {
    if (startDate && endDate) {
      return {
        from: new Date(startDate.timestamp),
        to: new Date(endDate.timestamp)
      };
    }
    return null;
  }, [startDate, endDate]);

  const displayText = useMemo(() => {
    if (startDate && endDate) {
      return `${startDate.dateString} - ${endDate.dateString}`;
    } else if (startDate) {
      return startDate.dateString;
    }
    return t('Select a date range...');
  }, [startDate, endDate, t]);

  return {
    startDate,
    endDate,
    markedDates,
    displayText,
    handleDayPress,
    handleClear,
    resetToSaved,
    getDateRange,
  };
};