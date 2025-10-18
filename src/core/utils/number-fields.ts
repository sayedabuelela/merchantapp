export const currencyNumber = (number: number) => {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(number);
}

export const isDecimal = (value: string) => {
    const regex = /^\d+(\.\d{1,2})?$/;
    return regex.test(value);
}

export const getForemateTowDigits = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const decimalNumber = (value: string) => {
    if (value === "") {
        return '';
    }
    if (isDecimal(value)) {
        return getForemateTowDigits(value);
    }
    return value;
}

export const formatInputCurrency = (text?: string) => {
    if (!text) return "";
    let numericValue = text.replace(/[^0-9.]/g, "");

    if (!numericValue) return "";

    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};