import {
  setCrashlyticsUser,
  clearCrashlyticsUser,
  recordError,
  recordNonFatalError,
  logMessage,
} from './crashlytics.service';

export const useCrashlytics = () => ({
  setCrashlyticsUser,
  clearCrashlyticsUser,
  recordError,
  recordNonFatalError,
  logMessage,
});
