// ItemsList.tsx
import React, { memo } from 'react';
import { View } from 'react-native';
import { ItemType } from '../../../payment-links.scheme';
import ListEmpty from '../ListEmpty';
import ItemCard from './ItemCard';

interface ItemsListProps {
    items: ItemType[];
    onEdit: (index: number) => void;
    onDelete: (index: number) => void;
    onQuantityChange: (index: number, quantity: number) => void;
}

const ItemsList = memo(({ items, onEdit, onDelete, onQuantityChange }: ItemsListProps) => {
    if (items.length === 0) {
        return <ListEmpty type="items" />;
    }

    return (
        <View className="space-y-2">
            {items.map((item, index) => (
                <ItemCard
                    key={`${item.description}-${index}`}
                    index={index}
                    item={item}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onQuantityChange={onQuantityChange}
                />
            ))}
        </View>
    );
});

export default ItemsList;