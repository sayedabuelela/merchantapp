import ComingSoonView from '@/src/modules/coming-soon/coming-soon.view'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowUpLeftIcon } from 'react-native-heroicons/outline'

const TransfersScreen = () => {
    const { t } = useTranslation()
    return (
        <ComingSoonView
            title={t('Transfers')}
            icon={<ArrowUpLeftIcon size={64} color="#001F5F" />}
            description={t("Soon you'll be able to transfer funds quickly and securely between accounts using the app. Stay tuned!")}
        />
    )
}

export default TransfersScreen