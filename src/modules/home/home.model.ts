// Home Tab Types
export type HomeTabType = 'all' | 'orders' | 'payouts' | 'transfers';

// Date Filter Types
export type DateFilterType = 'today' | 'yesterday' | '7days' | '30days' | 'custom';

export interface HomeDateFilters {
  dateFrom?: string;      // ISO format YYYY-MM-DD for API
  dateTo?: string;        // ISO format YYYY-MM-DD for API
  filterType: DateFilterType;
  customFrom?: Date;      // For UI display only
  customTo?: Date;        // For UI display only
}
