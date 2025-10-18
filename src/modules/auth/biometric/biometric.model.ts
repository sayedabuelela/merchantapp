// modules/auth/biometric/biometric.model.ts
export interface BiometricInfo {
    available: boolean;
    biometryType: 'FaceID' | 'TouchID' | 'Biometric' | null;
}

export interface BiometricResult {
    success: boolean;
    error?: string;
}

export interface StoredCredentials {
    email: string;
    password: string;
}
