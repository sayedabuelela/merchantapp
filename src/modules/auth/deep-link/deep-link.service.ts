import { AxiosInstance } from 'axios';
import { AuthByTokenResponse } from './deep-link.model';

/**
 * Authenticate using decrypted token from deep link
 * @param api - Axios instance
 * @param decryptedToken - Decrypted JWT token
 * @param decryptedMerchantId - Decrypted merchant ID
 * @returns AuthByTokenResponse with real accessToken
 */
export const authenticateByToken = async (
  api: AxiosInstance,
  decryptedToken: string,
  decryptedMerchantId: string
): Promise<AuthByTokenResponse> => {
  const response = await api.post<AuthByTokenResponse>(
    '/v2/identity/auth-by-token',
    {}, // Empty body - auth info passed via headers
    {
      headers: {
        Authorization: decryptedToken,
        authmerchantid: decryptedMerchantId,
      },
    }
  );

  return response.data;
};
