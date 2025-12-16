import { AES, CBC, Pkcs7, Hex, Utf8 } from 'crypto-es';
import { ENCRYPTION_KEY, ENCRYPTION_IV } from '@/src/core/environment/environments';


export const decryptToken = (encryptedHex: string): string => {
  try {
    // Validate input
    if (!encryptedHex || typeof encryptedHex !== 'string') {
      throw new Error('Invalid encrypted data');
    }

    // Validate encryption config
    if (!ENCRYPTION_KEY || !ENCRYPTION_IV) {
      console.error('[Crypto] Missing encryption config:', {
        hasKey: !!ENCRYPTION_KEY,
        hasIV: !!ENCRYPTION_IV,
        keyLength: ENCRYPTION_KEY?.length,
        ivLength: ENCRYPTION_IV?.length,
      });
      throw new Error('Missing encryption configuration (ENCRYPTION_KEY or ENCRYPTION_IV)');
    }

    // Parse hex strings to WordArray
    const key = Hex.parse(ENCRYPTION_KEY);
    const iv = Hex.parse(ENCRYPTION_IV);
    const ciphertext = Hex.parse(encryptedHex);

    // Decrypt using AES-CBC (same algorithm as Web Crypto API)
    const decrypted = AES.decrypt(
      { ciphertext },
      key,
      {
        iv,
        mode: CBC,
        padding: Pkcs7,
      }
    );

    // Convert to UTF-8 string
    const decryptedText = decrypted.toString(Utf8);

    // Validate output
    if (!decryptedText) {
      throw new Error('Decryption resulted in empty string');
    }

    return decryptedText;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt token. The link may be invalid or expired.');
  }
};
