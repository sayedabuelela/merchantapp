import React from 'react'
import { useTranslation } from 'react-i18next'
import ComingSoonView from '@/src/modules/coming-soon/coming-soon.view'
import { POSServiceIcon } from '@/src/shared/assets/svgs'

const DevicesScreen = () => {
  const { t } = useTranslation()
  return (
    <ComingSoonView
      title={t('POS Devices')}
      icon={<POSServiceIcon />}
      description={t("Browse supported POS devices and request new ones, all in one place. This feature is launching soon.")} />
  )
}

export default DevicesScreen