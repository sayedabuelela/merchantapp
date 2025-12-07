/**
 * Number Input Utilities
 * Handles parsing and formatting of decimal number inputs for fee fields
 */

/**
 * Parses user input text into a valid number or undefined
 * Handles decimals and ensures single decimal point
 *
 * @param text - Raw user input string
 * @returns Parsed number or undefined if invalid
 *
 * @example
 * parseDecimalInput('123') // 123
 * parseDecimalInput('12.5') // 12.5
 * parseDecimalInput('.5') // 0.5
 * parseDecimalInput('') // undefined
 * parseDecimalInput('12.') // undefined (incomplete)
 * parseDecimalInput('abc') // undefined
 */
export const parseDecimalInput = (text: string): number | undefined => {
    // Remove all non-numeric characters except decimal point
    const cleaned = text.replace(/[^0-9.]/g, '');

    // Return undefined for empty or just decimal point
    if (cleaned === '' || cleaned === '.') {
        return undefined;
    }

    // Ensure only one decimal point exists
    const parts = cleaned.split('.');
    if (parts.length > 2) {
        return undefined;
    }

    // Don't parse if ends with decimal point (user still typing)
    if (cleaned.endsWith('.')) {
        return undefined;
    }

    // Parse to float
    const parsed = parseFloat(cleaned);

    // Return undefined if NaN, otherwise return the number
    return isNaN(parsed) ? undefined : parsed;
};

/**
 * Formats a number value for display in input field
 * Preserves decimals and handles undefined/zero
 *
 * @param value - Number to format or undefined
 * @returns Formatted string for display
 *
 * @example
 * formatDecimalDisplay(123) // '123'
 * formatDecimalDisplay(12.5) // '12.5'
 * formatDecimalDisplay(0) // ''
 * formatDecimalDisplay(undefined) // ''
 */
export const formatDecimalDisplay = (value: number | undefined): string => {
    if (value === undefined || value === 0) {
        return '';
    }
    return String(value);
};

/**
 * Validates if a string can be processed as decimal input
 * Allows partial input states like '12.' for better UX
 *
 * @param text - Text to validate
 * @returns True if valid decimal format (complete or partial)
 *
 * @example
 * isValidDecimalString('123') // true
 * isValidDecimalString('12.5') // true
 * isValidDecimalString('12.') // true (partial)
 * isValidDecimalString('.') // true (partial)
 * isValidDecimalString('abc') // false
 * isValidDecimalString('12.3.4') // false
 */
export const isValidDecimalString = (text: string): boolean => {
    // Allow empty string
    if (text === '') {
        return true;
    }

    // Remove all non-numeric characters except decimal point
    const cleaned = text.replace(/[^0-9.]/g, '');

    // Check if cleaned matches original (no invalid chars)
    if (cleaned !== text) {
        return false;
    }

    // Check for multiple decimal points
    const decimalCount = (text.match(/\./g) || []).length;
    if (decimalCount > 1) {
        return false;
    }

    return true;
};

/**
 * Cleans user input text for numeric fields
 * Removes invalid characters and ensures single decimal point
 *
 * @param text - Raw user input
 * @returns Cleaned text ready for parsing
 *
 * @example
 * cleanDecimalInput('12.34') // '12.34'
 * cleanDecimalInput('12..34') // '12.34'
 * cleanDecimalInput('abc12.34xyz') // '12.34'
 */
export const cleanDecimalInput = (text: string): string => {
    // Remove all non-numeric characters except decimal point
    let cleaned = text.replace(/[^0-9.]/g, '');

    // Ensure only one decimal point - keep first occurrence
    const parts = cleaned.split('.');
    if (parts.length > 2) {
        cleaned = parts[0] + '.' + parts.slice(1).join('');
    }

    return cleaned;
};
