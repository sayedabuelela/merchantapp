// FeeItem.tsx
import FontText from '@/src/shared/components/FontText';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { EllipsisVerticalIcon } from 'react-native-heroicons/outline';
import * as DropdownMenu from 'zeego/dropdown-menu';
import { FeeType } from '../../../payment-links.scheme';
interface FeeItemProps {
    fee: FeeType;
    onEdit: () => void;
    onDelete: () => void;
}

const FeeItem = ({ fee, onEdit, onDelete }: FeeItemProps) => {
    const { t } = useTranslation();

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
                        <FontText type="body" weight="bold" className="text-black text-base">
                            {fee.flatFee}
                        </FontText>
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