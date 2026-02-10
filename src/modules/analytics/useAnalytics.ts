import { AnalyticsEvents } from './analytics.constants';
import { trackEvent, setUserProperties, identifyUser } from './analytics.service';
import Constants from 'expo-constants';

export const useAnalytics = () => ({
  trackLogin: (method: 'credentials' | 'biometric' | '2fa') => {
    trackEvent(AnalyticsEvents.LOGIN_SUCCESS, { method });
  },

  trackPaymentLinkCreated: (amount: number, currency: string) => {
    trackEvent(AnalyticsEvents.PAYMENT_LINK_CREATED, { amount, currency });
  },

  trackPaymentLinkPaid: (amount: number, currency: string) => {
    trackEvent(AnalyticsEvents.PAYMENT_LINK_PAID, { amount, currency });
  },

  trackAppUpdateAccepted: () => {
    trackEvent(AnalyticsEvents.APP_UPDATE_ACCEPTED);
  },

  setUserProperties: (merchantId: string, mode: string) => {
    setUserProperties({
      merchant_id: merchantId,
      mode,
      app_version: Constants.expoConfig?.version ?? null,
    });
    identifyUser(merchantId);
  },
});
