import { CheckBoxEmptyIcon, CheckBoxFilledIcon } from '@/src/shared/assets/svgs'
import FontText from '@/src/shared/components/FontText'
import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { FlatList, Pressable, ScrollView, View } from 'react-native'
import { BelongsTo } from '../../auth/auth.model'

export interface StoreItemProps {
    merchantId: string,
    storeName: string,
    businessLogoUrl?: string
    onSelectStore: (merchantId: string) => void
}

export const StoreItem = ({ merchantId, storeName, businessLogoUrl, onSelectStore }: StoreItemProps) => {
    return (
        <Pressable className='border border-stroke-main rounded p-2 flex-row mb-2' onPress={() => onSelectStore(merchantId)}>
            {/* <CheckBoxEmptyIcon /> */}
            <CheckBoxEmptyIcon />
            {/* <CheckBoxFilledIcon/> */}
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

const StoresList = ({ stores, onSelectStore }: { stores: BelongsTo[]; onSelectStore: (merchantId: string) => void }) => {
    // console.log('stores', stores);

    return (
        <BottomSheetScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}>
            {stores?.map((store) => (
                <StoreItem key={store.merchantId} {...store} onSelectStore={onSelectStore} />
            ))}
        </BottomSheetScrollView>
    )
}

export default StoresList