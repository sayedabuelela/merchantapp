export const AnalyticsEvents = {
  LOGIN_SUCCESS: 'login_success',
  APP_UPDATE_ACCEPTED: 'app_update_accepted',
  PAYMENT_LINK_CREATED: 'payment_link_created',
  PAYMENT_LINK_PAID: 'payment_link_paid',
} as const;

/** Events that should only be tracked in LIVE mode */
export const LIVE_ONLY_EVENTS = new Set([
  AnalyticsEvents.PAYMENT_LINK_CREATED,
  AnalyticsEvents.PAYMENT_LINK_PAID,
]);
