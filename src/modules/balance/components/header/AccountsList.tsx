import { cn } from "@/src/core/utils/cn";
import { BelongsTo } from "@/src/modules/auth/auth.model";
import { CheckBoxFilledIcon, CheckBoxEmptyIcon } from "@/src/shared/assets/svgs";
import FontText from "@/src/shared/components/FontText";
import { FlatList, Pressable, View } from "react-native";
import { Account } from "../../balance.model";
import { currencyNumber } from "@/src/core/utils/number-fields";
import { useTranslation } from "react-i18next";



export interface StoreItemProps {
    accountId: string,
    accountName: string,
    onSelectAccount: (account: { accountId: string; accountName: string }) => void,
    accountBalance: number,
    isActive?: boolean
}

export const AccountItem = ({ accountId, accountName, onSelectAccount, accountBalance, isActive }: StoreItemProps) => {
    const { t } = useTranslation();
    return (
        <Pressable className={cn('border border-stroke-main rounded p-2 flex-row mb-2', isActive && 'border-primary')} onPress={() => onSelectAccount({ accountId, accountName })}>
            {isActive ? <CheckBoxFilledIcon /> : <CheckBoxEmptyIcon />}
            <View className='ml-2 flex-1'>
                <View className="flex-row items-center justify-between">
                    <FontText type="body" weight="semi" className="text-content-secondary text-sm capitalize">
                        {accountName === 'all' ? t('All Accounts') : accountName}
                    </FontText>

                    <FontText type="body" weight="semi" className="text-content-primary text-sm">
                        {currencyNumber(accountBalance)} {t('EGP')}
                    </FontText>
                </View>
                <FontText type="body" weight="regular" className="text-light-gray text-xs">
                    {accountName === 'all' ? t('Overview') : accountId}
                </FontText>
            </View>
        </Pressable>
    )
}

interface Props { accounts: Account[], setActiveAccount: (account: { accountId: string; accountName: string }) => void, activeAccount: { accountId: string; accountName: string } }

const AccountsList = ({ accounts, setActiveAccount, activeAccount }: Props) => {

    const handleSelectAccount = (account: { accountId: string; accountName: string }) => {
        setActiveAccount(account);
    };
    console.log('accounts : ', accounts);
    return (
        <View className="max-h-[180px]">
            <FlatList
                data={accounts}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <AccountItem
                        key={item.accountId}
                        accountId={item.accountId}
                        accountName={item.accountName}
                        accountBalance={item.availableBalance}
                        onSelectAccount={handleSelectAccount}
                        isActive={activeAccount.accountId === item.accountId}
                    />
                )}
            />
        </View>
    )
}

export default AccountsList