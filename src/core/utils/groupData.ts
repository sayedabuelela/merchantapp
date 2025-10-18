
export type GroupedHeader = { type: "header"; date: string };
export type GroupedItem<T> = { type: "item" } & T;
export type GroupedRow<T> = GroupedHeader | GroupedItem<T>;

export const groupByDate = <T extends { creationDate: string }>(
    items: T[]
): { date: string; items: T[] }[] => {
    const groups: Record<string, T[]> = {};

    items.forEach((item) => {
        const dateKey = new Date(item.creationDate).toDateString();
        if (!groups[dateKey]) groups[dateKey] = [];
        groups[dateKey].push(item);
    });

    return Object.entries(groups).map(([date, items]) => ({ date, items }));
}