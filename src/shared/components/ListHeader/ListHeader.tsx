import FontText from '@/src/shared/components/FontText';
import { AnimatePresence, MotiView } from 'moti';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, View } from 'react-native';
import { FunnelIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import SearchInput from '@/src/modules/payment-links/components/SearchInput';
import { cn } from '@/src/core/utils/cn';

interface Props {
    title: string;
    onFilterPress: () => void;
    onSubmitSearch: (text: string) => void;
    isFilterOpen: boolean;
    isListEmpty: boolean;
    hasFilters: boolean;
    handleClearSearch: () => void;
    searchValue: string;
    // Optional action button (e.g., Plus icon for creating new items)
    actionButton?: {
        icon: React.ReactNode;
        onPress: () => void;
    };
    className?: string;
}

const ListHeader = ({
    title,
    onFilterPress,
    onSubmitSearch,
    isFilterOpen,
    isListEmpty,
    hasFilters,
    handleClearSearch,
    searchValue,
    actionButton,
    className
}: Props) => {
    const { t } = useTranslation();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    console.log('hasFilters : ', hasFilters);
    return (
        <View className={cn("px-6", Platform.OS === 'android' ? 'pt-4' : 'pt-0', className)}>
            <View className="flex-row justify-between items-center">
                <FontText
                    type="head"
                    weight="bold"
                    className="text-content-primary text-xl self-start"
                >
                    {title}
                </FontText>
                <View className='flex-row gap-x-4'>
                    {(!isListEmpty || hasFilters) && <>
                        <Pressable onPress={() => setIsSearchOpen(!isSearchOpen)}>
                            <MagnifyingGlassIcon size={24} color="#001F5F" fill={isSearchOpen ? '#001F5F' : '#fff'} />
                        </Pressable>
                        <Pressable onPress={onFilterPress}>
                            <FunnelIcon size={24} color="#001F5F" fill={(isFilterOpen || hasFilters) ? '#001F5F' : '#fff'} />
                        </Pressable>
                    </>
                    }
                    {actionButton && (
                        <Pressable onPress={actionButton.onPress}>
                            {actionButton.icon}
                        </Pressable>
                    )}
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

export default ListHeader;