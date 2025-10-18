export function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidPhone(phone: string, countryCode?: string): boolean {
    if (!phone) return false;
    if (!/^\d{6,15}$/.test(phone)) return false; // basic digits check
    if (countryCode && !/^\+\d{1,4}$/.test(countryCode)) return false;
    return true;
}