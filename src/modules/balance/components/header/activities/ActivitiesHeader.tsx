import { useTranslation } from 'react-i18next';
import ListHeader from '@/src/shared/components/ListHeader/ListHeader';
import NotificationBell from '@/src/shared/components/NotificationBell';
import {I18nManager, Pressable, View} from 'react-native';
import { Account, ActivityType } from '../../../balance.model';
import FontText from '@/src/shared/components/FontText';
import { cn } from '@/src/core/utils/cn';
import AccountsBtn from '../AccountsBtn';
import { useNotificationsVM } from '@/src/modules/notifications/viewmodels/useNotificationsVM';
import {ChevronLeftIcon} from "react-native-heroicons/outline";
import {useNavigation} from "expo-router";
const isRTL = I18nManager.isRTL;
interface Props {
    type: ActivityType;
    notificationsCount?: number;
    // Search/Filter props (only used when type !== 'overview')
    onFilterPress?: () => void;
    onSubmitSearch?: (text: string) => void;
    isFilterOpen?: boolean;
    isListEmpty?: boolean;
    hasFilters?: boolean;
    handleClearSearch?: () => void;
    searchValue?: string;
    className?: string;
    accounts?: Account[];
    setShowAccountsModal?: (value: boolean) => void;
}

const ActivitiesHeader = ({
    type,
    notificationsCount = 0,
    onFilterPress,
    onSubmitSearch,
    isFilterOpen,
    isListEmpty,
    hasFilters,
    handleClearSearch,
    searchValue,
    className,
    accounts,
    setShowAccountsModal
}: Props) => {
    const { t } = useTranslation();
    const { unSeenCount } = useNotificationsVM();
    const unseenCount = unSeenCount;
    const {goBack} = useNavigation();
    // Overview tab: Show title + notification bell only
    // if (type === 'overview') {
    //     return (
    //         <View className='px-6'>
    //             {(accounts !== undefined && accounts?.length > 1) && (
    //                 <AccountsBtn
    //                     onPress={() => setShowAccountsModal?.(true)}
    //                     className="self-start"
    //                 />
    //             )}
    //             <View className={cn("flex-row justify-between items-center", className)}>
    //                 <FontText type="head" weight="bold" className="text-xl text-content-primary">
    //                     {t('Balances')}
    //                 </FontText>
    //                 <NotificationBell notificationsCount={notificationsCount} />
    //             </View>
    //         </View>
    //     );
    // }
    return (
        <View>
            {(accounts !== undefined && accounts?.length > 1) && (
                <AccountsBtn
                    onPress={() => setShowAccountsModal?.(true)}
                    className="self-start ml-6"
                />
            )}
            {type === 'overview' ? (
                <View className={cn("px-6 flex-row justify-between items-center", className)}>
                    <Pressable onPress={goBack} style={{marginEnd: 10}}>
                        <ChevronLeftIcon size={24} color="#0F172A"
                                         style={isRTL ? {transform: [{rotate: '180deg'}]} : {}}/>
                    </Pressable>
                    <FontText type="head" weight="bold" className="text-xl text-content-primary">
                        {t('Balances')}
                    </FontText>
                    <NotificationBell notificationsCount={unseenCount} />
                </View>
            ) : (
                <ListHeader
                    title={t('Balances')}
                    onFilterPress={onFilterPress!}
                    onSubmitSearch={onSubmitSearch!}
                    isFilterOpen={isFilterOpen!}
                    isListEmpty={isListEmpty!}
                    hasFilters={hasFilters!}
                    handleClearSearch={handleClearSearch!}
                    searchValue={searchValue!}
                    className={className}
                    backBtn
                />
            )}
        </View>
    )

    // All other tabs: Show title + search + filter
    // return (
    //     <ListHeader
    //         title={t('Balances')}
    //         onFilterPress={onFilterPress!}
    //         onSubmitSearch={onSubmitSearch!}
    //         isFilterOpen={isFilterOpen!}
    //         isListEmpty={isListEmpty!}
    //         hasFilters={hasFilters!}
    //         handleClearSearch={handleClearSearch!}
    //         searchValue={searchValue!}
    //         className={className}
    //     />
    // );
}

export default ActivitiesHeader;