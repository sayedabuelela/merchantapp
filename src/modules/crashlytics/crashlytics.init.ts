import {
  getCrashlytics,
  setCrashlyticsCollectionEnabled,
  log,
} from '@react-native-firebase/crashlytics';
import { useEnvironmentStore } from '@/src/core/environment/environments.store';

export const initializeCrashlytics = () => {
  try {
    const crashlyticsInstance = getCrashlytics();

    if (__DEV__) {
      setCrashlyticsCollectionEnabled(crashlyticsInstance, false);
      return;
    }

    setCrashlyticsCollectionEnabled(crashlyticsInstance, true);

    const { environment, mode } = useEnvironmentStore.getState();
    log(crashlyticsInstance, `App started: environment=${environment}, mode=${mode}`);
  } catch (e) {
    console.warn('[Crashlytics] initializeCrashlytics failed:', e);
  }
};
