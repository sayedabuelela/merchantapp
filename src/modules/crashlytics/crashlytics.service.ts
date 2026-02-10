import {
  getCrashlytics,
  setUserId,
  setAttributes,
  log,
  recordError as firebaseRecordError,
} from '@react-native-firebase/crashlytics';
import Constants from 'expo-constants';
import { useAuthStore } from '@/src/modules/auth/auth.store';
import { useEnvironmentStore } from '@/src/core/environment/environments.store';

const crashlyticsInstance = getCrashlytics();

export const setCrashlyticsUser = () => {
  if (__DEV__) return;

  try {
    const { user } = useAuthStore.getState();
    const { environment, mode } = useEnvironmentStore.getState();

    if (!user) return;

    setUserId(crashlyticsInstance, user.merchantId);
    setAttributes(crashlyticsInstance, {
      merchantId: user.merchantId,
      email: user.email || user.signupKey,
      environment,
      mode,
      appVersion: Constants.expoConfig?.version ?? 'unknown',
    });
  } catch (e) {
    console.warn('[Crashlytics] setCrashlyticsUser failed:', e);
  }
};

export const clearCrashlyticsUser = () => {
  if (__DEV__) return;

  try {
    setUserId(crashlyticsInstance, '');
    setAttributes(crashlyticsInstance, {
      merchantId: '',
      email: '',
      environment: '',
      mode: '',
    });
  } catch (e) {
    console.warn('[Crashlytics] clearCrashlyticsUser failed:', e);
  }
};

export const recordError = (error: Error, context?: string) => {
  if (__DEV__) {
    console.error(`[Crashlytics] ${context ?? 'Error'}:`, error);
    return;
  }

  try {
    if (context) {
      log(crashlyticsInstance, context);
    }
    firebaseRecordError(crashlyticsInstance, error);
  } catch (e) {
    console.warn('[Crashlytics] recordError failed:', e);
  }
};

export const recordNonFatalError = (
  name: string,
  message: string,
  context?: string,
) => {
  const error = new Error(message);
  error.name = name;
  recordError(error, context);
};

export const logMessage = (message: string) => {
  if (__DEV__) {
    console.log(`[Crashlytics] ${message}`);
    return;
  }

  try {
    log(crashlyticsInstance, message);
  } catch (e) {
    console.warn('[Crashlytics] logMessage failed:', e);
  }
};
