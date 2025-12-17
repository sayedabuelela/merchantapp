import { cn } from '@/src/core/utils/cn'
import { CheckBoxEmptyIcon, CheckBoxFilledIcon } from '@/src/shared/assets/svgs'
import FontText from '@/src/shared/components/FontText'
import { ScrollView, Pressable, View } from 'react-native'
import { BelongsTo } from '../../auth/auth.model'

export interface StoreItemProps {
    merchantId: string,
    storeName: string,
    businessLogoUrl?: string
    onSelectStore: (merchantId: string) => void
    isActive?: boolean
}

interface StoreListProps {
    stores: BelongsTo[];
    activeStore: string | undefined;
    setActiveStore: (merchantId: string) => void;
}

export const StoreItem = ({ merchantId, storeName, businessLogoUrl, onSelectStore, isActive }: StoreItemProps) => {
    return (
        <Pressable className={cn('border border-stroke-main rounded p-2 flex-row mb-2', isActive && 'border-primary')} onPress={() => onSelectStore(merchantId)}>
            {isActive ? <CheckBoxFilledIcon /> : <CheckBoxEmptyIcon />}
            <View className='items-center ml-2'>
                <FontText type="body" weight="semi" className="text-content-secondary text-sm self-start">
                    {storeName}
                </FontText>
                <FontText type="body" weight="regular" className="text-light-gray text-xs self-start">
                    {merchantId}
                </FontText>
            </View>
        </Pressable>
    )
}

const StoresList = ({ stores, activeStore, setActiveStore }: StoreListProps) => {
    return (
        <>
            {stores?.map((store) => (
                <StoreItem
                    key={store.merchantId}
                    {...store}
                    onSelectStore={() => {
                        setActiveStore(store.merchantId);
                    }}
                    isActive={activeStore === store.merchantId}
                />
            ))}
        </>
    )
}

export default StoresList