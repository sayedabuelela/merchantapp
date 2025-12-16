import { AxiosInstance } from 'axios';
import { AuthResponse } from '../auth.model';

/**
 * Authenticate using decrypted token from deep link
 * 
 * This endpoint returns the same structure as the regular authenticate endpoint,
 * allowing unified handling of auth responses across login flows.
 * 
 * @param api - Axios instance
 * @param decryptedToken - Decrypted JWT token from deep link
 * @param decryptedMerchantId - Decrypted merchant ID from deep link
 * @returns AuthResponse - Same structure as regular authenticate endpoint
 */
export const authenticateByToken = async (
  api: AxiosInstance,
  decryptedToken: string,
  decryptedMerchantId: string,
  v2?: string
): Promise<AuthResponse> => {
  // Construct query params
  const queryParams = new URLSearchParams();
  if (v2) queryParams.append('v2', v2);

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

  const response = await api.get<AuthResponse>(
    `/v2/identity/auth-by-token${queryString}`,
    {
      headers: {
        Authorization: decryptedToken,
        authmerchantid: decryptedMerchantId,
      },
    }
  );

  return response.data;
};
