export const isInstantSettlementUnavailable = (now: Date = new Date()): boolean => {
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    return year === 2026 && month === 4 && (day === 26 || day === 27);
};
