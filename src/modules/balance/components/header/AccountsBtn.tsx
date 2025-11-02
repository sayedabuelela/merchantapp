import { AccountsIcon } from '@/src/shared/assets/svgs'
import FontText from '@/src/shared/components/FontText'
import { useTranslation } from 'react-i18next'
import { Pressable } from 'react-native'
import { ChevronDownIcon } from 'react-native-heroicons/outline'
import { useBalanceContext } from '../../context/BalanceContext'

const AccountsBtn = ({ onPress }: { onPress: () => void }) => {
    const { t } = useTranslation();
    const { activeAccount } = useBalanceContext();
    return (
        <Pressable onPress={onPress} className='flex-row items-center rounded-3xl border border-[#F5F6F6] p-1'>
            <AccountsIcon />
            <FontText type="body" weight="regular" className="text-content-primary ml-1 text-xs">
                {activeAccount.accountName === 'all' ? t('All accounts') : activeAccount.accountName}
            </FontText>
            <ChevronDownIcon size={18} color="#001F5F" />
        </Pressable>
    )
}

export default AccountsBtn