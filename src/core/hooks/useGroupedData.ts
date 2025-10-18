import { useMemo } from "react";
import { GroupedRow } from "../utils/groupData";

export function useGroupedData<T extends { creationDate: string }>(
    groupedData: { date: string; items: T[] }[]
) {
    return useMemo(() => {
        const indices: number[] = [];
        const flat: GroupedRow<T>[] = [];

        groupedData.forEach((group) => {
            indices.push(flat.length);
            flat.push({ type: "header", date: group.date });

            group.items.forEach((item) => {
                flat.push({ type: "item", ...item });
            });
        });

        return { listData: flat, stickyHeaderIndices: indices };
    }, [groupedData]);
}