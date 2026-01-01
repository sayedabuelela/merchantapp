/**
 * Shared formatter utilities for payment detail components
 */

/**
 * Formats amount fields - returns "0 EGP" for null/undefined/0, otherwise formats the number
 */
export const formatAmount = (value: number | string | null | undefined, currency: string): string => {
    if (value === null || value === undefined || value === 0) return `0.00 ${currency}`;
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numericValue)) return `0.00 ${currency}`;
    const formattedValue = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(numericValue);
    return `${formattedValue} ${currency}`;
};

/**
 * Formats text fields - returns "--" for null/undefined, otherwise returns the string
 */
export const formatText = (value: string | null | undefined): string => {
    return value || "--";
};

/**
 * Capitalizes first letter of each word (handles camelCase to Title Case)
 * Example: "vodafoneCash" -> "Vodafone Cash"
 */
export const capitalizeWords = (value: string | null | undefined): string => {
    if (!value) return "--";
    return value
        .split(/(?=[A-Z])/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};
