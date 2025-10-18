// FeesList.tsx
import React, { memo } from 'react';
import { View } from 'react-native';
import { FeeType } from '../../../payment-links.scheme';
import ListEmpty from '../ListEmpty';
import FeeItem from './FeeItem';

interface FeesListProps {
    fees: FeeType[];
    onEdit: (index: number) => void;
    onDelete: (index: number) => void;
}

const FeesList = memo(({ fees, onEdit, onDelete }: FeesListProps) => {
    if (fees.length === 0) {
        return <ListEmpty type="fees" />;
    }

    return (
        <View className="space-y-2">
            {fees.map((fee, index) => (
                <FeeItem
                    key={`${fee.name}-${index}`}
                    fee={fee}
                    onEdit={() => onEdit(index)}
                    onDelete={() => onDelete(index)}
                />
            ))}
        </View>
    );
});

export default FeesList;