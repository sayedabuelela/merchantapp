import { AccountsIcon } from '@/src/shared/assets/svgs'
import FontText from '@/src/shared/components/FontText'
import { useTranslation } from 'react-i18next'
import { Pressable } from 'react-native'
import { ChevronDownIcon } from 'react-native-heroicons/outline'
import { useBalanceContext } from '../../context/BalanceContext'
import { cn } from '@/src/core/utils/cn'

const AccountsBtn = ({ onPress, className }: { onPress: () => void, className?: string }) => {
    const { t } = useTranslation();
    const { activeAccount } = useBalanceContext();
    return (
        <Pressable onPress={onPress} className={cn('flex-row items-center rounded-full border border-[#F5F6F6] p-1', className)}>
            <AccountsIcon />
            <FontText type="body" weight="regular" className="text-primary ml-1 mr-2 text-xs">
                {activeAccount.accountName === 'all' ? t('All accounts') : activeAccount.accountName}
            </FontText>
            <ChevronDownIcon size={14} color="#001F5F" />
        </Pressable>
    )
}

export default AccountsBtn