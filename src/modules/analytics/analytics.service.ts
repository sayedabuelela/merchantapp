import { getAnalytics, logEvent, setUserId, setUserProperty } from '@react-native-firebase/analytics';
import { Mode } from '@/src/core/environment/environments';
import { useEnvironmentStore } from '@/src/core/environment/environments.store';
import { LIVE_ONLY_EVENTS } from './analytics.constants';

const analytics = getAnalytics();

export const trackEvent = (
  name: string,
  params?: Record<string, string | number | boolean>,
) => {
  if (__DEV__) return;

  try {
    const { mode, environment } = useEnvironmentStore.getState();

    if (LIVE_ONLY_EVENTS.has(name) && mode !== Mode.LIVE) return;

    logEvent(analytics, name, {
      ...params,
      mode,
      environment,
    });
  } catch (e) {
    console.warn('[Analytics] trackEvent failed:', e);
  }
};

export const setUserProperties = (
  props: Record<string, string | null>,
) => {
  if (__DEV__) return;

  try {
    for (const [key, value] of Object.entries(props)) {
      setUserProperty(analytics, key, value);
    }
  } catch (e) {
    console.warn('[Analytics] setUserProperties failed:', e);
  }
};

export const identifyUser = (userId: string) => {
  if (__DEV__) return;

  try {
    setUserId(analytics, userId);
  } catch (e) {
    console.warn('[Analytics] identifyUser failed:', e);
  }
};
