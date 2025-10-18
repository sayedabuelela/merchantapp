import FontText from '@/src/shared/components/FontText';
import { AnimatePresence, MotiView } from 'moti';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { FunnelIcon, MagnifyingGlassIcon, PlusIcon } from 'react-native-heroicons/outline';
import SearchInput from '../SearchInput';
interface Props {
    onPlusPress: () => void;
    onFilterPress: () => void;
    onSubmitSearch: (text: string) => void;
    isFilterOpen: boolean;
    isListEmpty: boolean;
    hasFilters: boolean;
    handleClearSearch: () => void;
    searchValue: string;
}
const PaymentLinksHeader = ({ onPlusPress, onFilterPress, onSubmitSearch, isFilterOpen, isListEmpty, hasFilters, handleClearSearch, searchValue }: Props) => {
    const { t } = useTranslation();
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <View className="px-6">
            <View className="flex-row justify-between items-center">
                <FontText
                    type="head"
                    weight="bold"
                    className="text-content-primary text-2xl self-start"
                >
                    {t('Payment Links')}
                </FontText>
                <View className='flex-row gap-x-4'>
                    {!isListEmpty && <>
                        <Pressable onPress={() => setIsSearchOpen(!isSearchOpen)}>
                            <MagnifyingGlassIcon size={24} color="#001F5F" fill={isSearchOpen ? '#001F5F' : '#fff'} />
                        </Pressable>
                        <Pressable onPress={onFilterPress}>
                            <FunnelIcon size={24} color="#001F5F" fill={(isFilterOpen || hasFilters) ? '#001F5F' : '#fff'} />
                        </Pressable>
                    </>
                    }
                    <Pressable onPress={onPlusPress}>
                        <PlusIcon size={24} color="#001F5F" />
                    </Pressable>
                </View>
            </View>
            <AnimatePresence>
                {isSearchOpen && (
                    <MotiView
                        from={{ opacity: 0, translateY: -10 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        exit={{ opacity: 0, translateY: -10 }}
                        transition={{ type: 'timing', duration: 250 }}
                    >
                        <SearchInput
                            onSubmitSearch={onSubmitSearch}
                            placeholder={t('Search')}
                            onClear={handleClearSearch}
                            value={searchValue}
                        />
                    </MotiView>
                )}
            </AnimatePresence>
        </View>
    )
}

export default PaymentLinksHeader;