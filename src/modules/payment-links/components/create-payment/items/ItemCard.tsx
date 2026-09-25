// components/items/ItemCard.tsx
import { currencyLabel, isVirtualCurrency, toDisplayCode } from '@/src/core/constants/currencies';
import { currencyNumber } from '@/src/core/utils/number-fields';
import FontText from '@/src/shared/components/FontText';
import CurrencyToken from '@/src/shared/components/currency/CurrencyToken';
import React, { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { EllipsisVerticalIcon, MinusIcon, PlusIcon } from 'react-native-heroicons/outline';
import * as DropdownMenu from 'zeego/dropdown-menu';
import { ItemType } from '../../../payment-links.scheme';

interface ItemCardProps {
    item: ItemType;
    /** The link's currency — items carry none of their own. API id or display code. */
    currency?: string | null;
    index: number;
    onEdit: (index: number) => void;
    onDelete: (index: number) => void;
    onQuantityChange: (index: number, quantity: number) => void;
}

const ItemCard = memo(({ item, currency, index, onEdit, onDelete, onQuantityChange }: ItemCardProps) => {
    const { t } = useTranslation();
    const isVirtual = isVirtualCurrency(currency);

    const handleIncrement = useCallback(() => {
        onQuantityChange(index, item.quantity + 1);
    }, [index, item.quantity, onQuantityChange]);

    const handleDecrement = useCallback(() => {
        if (item.quantity > 1) {
            onQuantityChange(index, item.quantity - 1);
        }
    }, [index, item.quantity, onQuantityChange]);

    return (
        <View className="border border-tertiary p-4 rounded mb-2">
            <View className='flex-row justify-between'>
                <View>
                    <FontText type="body" weight="semi" className="text-content-secondary text-sm">
                        {t('Name')}
                    </FontText>
                    <FontText type="body" weight="bold" className="text-black text-base">
                        {item.description}
                    </FontText>

                    {item.unitPrice > 0 && (
                        <View className='mt-2'>
                            <FontText type="body" weight="semi" className="text-content-secondary text-sm">
                                {t('Price')}
                            </FontText>
                            {/* The currency here comes straight from the picker, so the
                                `_VIRTUAL` id is intact and can be trusted as the guard. */}
                            {isVirtual ? (
                                <View className="flex-row items-center gap-x-1">
                                    <FontText type="body" weight="bold" className="text-black text-base">
                                        {currencyNumber(item.unitPrice)}
                                    </FontText>
                                    <CurrencyToken code={toDisplayCode(currency)} size="lg" />
                                </View>
                            ) : (
                                <FontText type="body" weight="bold" className="text-black text-base">
                                    {`${currencyNumber(item.unitPrice)} ${currencyLabel(t, currency)}`}
                                </FontText>
                            )}
                        </View>
                    )}
                </View>

                <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                        <Pressable className="flex-row items-center">
                            <EllipsisVerticalIcon size={20} color="#001F5F" />
                        </Pressable>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Content>
                        <DropdownMenu.Item
                            key={String('edit')}
                            onSelect={() => onEdit(index)}
                        >
                            <DropdownMenu.ItemTitle>{t('Edit')}</DropdownMenu.ItemTitle>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                            key={String('delete')}
                            onSelect={() => onDelete(index)}
                        >
                            <DropdownMenu.ItemTitle style={{ color: 'red' }}>{t('Delete')}</DropdownMenu.ItemTitle>
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            </View>

            {/* Quantity Controls */}
            <View className='mt-4'>
                <FontText type="body" weight="semi" className="text-content-secondary text-sm mb-2">
                    {t('Quantity')}
                </FontText>
                <View className="flex-row items-center justify-between w-full h-11 px-4 border border-stroke-input rounded">
                    <Pressable onPress={handleDecrement} className="p-2">
                        <MinusIcon size={18} color="#001F5F" />
                    </Pressable>

                    <FontText type="body" weight="regular" className="text-content-primary text-base">
                        {item.quantity}
                    </FontText>

                    <Pressable onPress={handleIncrement} className="p-2">
                        <PlusIcon size={18} color="#001F5F" />
                    </Pressable>
                </View>
            </View>
        </View>
    );
});

export default ItemCard;