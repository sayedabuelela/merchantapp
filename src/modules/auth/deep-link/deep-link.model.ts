import { User } from '../auth.model';

/**
 * URL query parameters from deep link
 * These are encrypted values passed from the web portal
 */
export interface DeepLinkParams {
  accessToken: string;
  currentMerchantPayformanceId: string;
  refreshToken?: string;
  v2?: string;
}

/**
 * Result of successful deep link authentication
 */
export interface DeepLinkAuthResult {
  token: string;
  user: User;
  isLive: boolean;
}

/**
 * Deep link error codes for user-friendly error handling
 */
export type DeepLinkErrorCode =
  | 'MISSING_PARAMS'
  | 'DECRYPTION_FAILED'
  | 'AUTH_FAILED'
  | 'NETWORK_ERROR';

/**
 * Extended error type for deep link authentication
 */
export interface DeepLinkError extends Error {
  code?: DeepLinkErrorCode;
}
