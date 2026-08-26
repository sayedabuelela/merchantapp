// FeeItem.tsx
import { currencyLabel, isVirtualCurrency, toDisplayCode } from '@/src/core/constants/currencies';
import { currencyNumber } from '@/src/core/utils/number-fields';
import FontText from '@/src/shared/components/FontText';
import CurrencyToken from '@/src/shared/components/currency/CurrencyToken';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { EllipsisVerticalIcon } from 'react-native-heroicons/outline';
import * as DropdownMenu from 'zeego/dropdown-menu';
import { FeeType } from '../../../payment-links.scheme';
interface FeeItemProps {
    fee: FeeType;
    /** The link's currency — fees carry none of their own. API id or display code. */
    currency?: string | null;
    onEdit: () => void;
    onDelete: () => void;
}

const FeeItem = ({ fee, currency, onEdit, onDelete }: FeeItemProps) => {
    const { t } = useTranslation();
    const isVirtual = isVirtualCurrency(currency);

    return (
        <View className="border border-tertiary p-4 rounded mb-2">
            <View className='flex-row items-center justify-between'>
                <View>
                    <FontText type="body" weight="semi" className="text-content-secondary text-sm">
                        {t('Name')}
                    </FontText>
                    <FontText type="body" weight="bold" className="text-black text-base">
                        {fee.name}
                    </FontText>
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
                                onSelect={() => onEdit()}
                            >
                                <DropdownMenu.ItemTitle>{t('Edit')}</DropdownMenu.ItemTitle>
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                                key={String('delete')}
                                onSelect={() => onDelete()}
                            >
                                <DropdownMenu.ItemTitle style={{ color: 'red' }}>{t('Delete')}</DropdownMenu.ItemTitle>
                            </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            </View>
            <View className='flex-row items-center mt-2'>
                {fee.flatFee > 0 && (
                    <View className=''>
                        <FontText type="body" weight="semi" className="text-content-secondary text-sm">
                            {t('Flat fee')}
                        </FontText>
                        {/* The currency here comes straight from the picker, so the
                            `_VIRTUAL` id is intact and can be trusted as the guard. */}
                        {isVirtual ? (
                            <View className="flex-row items-center gap-x-1">
                                <FontText type="body" weight="bold" className="text-black text-base">
                                    {currencyNumber(fee.flatFee)}
                                </FontText>
                                <CurrencyToken code={toDisplayCode(currency)} size="lg" />
                            </View>
                        ) : (
                            <FontText type="body" weight="bold" className="text-black text-base">
                                {`${currencyNumber(fee.flatFee)} ${currencyLabel(t, currency)}`}
                            </FontText>
                        )}
                    </View>
                )}
                {fee.rate > 0 && (
                    <View className='ml-auto mr-auto'>
                        <FontText type="body" weight="semi" className="text-content-secondary text-sm">
                            {t('Rate')}
                        </FontText>
                        <FontText type="body" weight="bold" className="text-black text-base">
                            {fee.rate}%
                        </FontText>
                    </View>
                )}
            </View>
        </View>
    );
};

export default FeeItem;