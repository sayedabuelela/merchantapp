import { User } from '../auth.model';

// URL query parameters from deep link
export interface DeepLinkParams {
  accessToken: string; // Encrypted token (hex)
  currentMerchantPayformanceId: string; // Encrypted merchant ID (hex)
  refreshToken?: string; // Encrypted refresh token (ignored)
  v2?: string; // Version flag
}

// Response from POST /v2/identity/auth-by-token
export interface AuthByTokenResponse {
  body: {
    accessToken: {
      token: string;
      expires: string;
    };
    refreshToken?: {
      token: string;
      expires: string;
    };
    isLive: boolean;
  };
  success: boolean;
  message?: string;
}

// Response from GET /v2/identity/user (getMerchant)
export interface GetMerchantResponse {
  body: User; // Full user object
  success: boolean;
}

// Combined result from mutation
export interface DeepLinkAuthResult {
  realToken: string;
  fullUserData: User;
  isLive: boolean;
}

// Error handling
export interface DeepLinkError extends Error {
  code?: 'MISSING_PARAMS' | 'DECRYPTION_FAILED' | 'AUTH_FAILED' | 'NETWORK_ERROR';
}
