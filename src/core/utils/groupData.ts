export type GroupedHeader = { type: "header"; date: string };
export type GroupedItem<T> = { type: "item" } & T;
export type GroupedRow<T> = GroupedHeader | GroupedItem<T>;

export const groupByDate = <T extends Record<string, any>>(
    items: T[],
    dateKey: keyof T = 'createdAt' as keyof T
): { date: string; items: T[] }[] => {
    const groups: Record<string, T[]> = {};

    items.forEach((item) => {
        const dateValue = item[dateKey];
        const dateString = new Date(dateValue).toDateString();
        if (!groups[dateString]) groups[dateString] = [];
        groups[dateString].push(item);
    });

    return Object.entries(groups).map(([date, items]) => ({ date, items }));
}