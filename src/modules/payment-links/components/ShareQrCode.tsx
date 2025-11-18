import React from 'react'
import QRCode from 'react-native-qrcode-svg';
import { View } from 'react-native'
import FontText from '@/src/shared/components/FontText'
import { useTranslation } from 'react-i18next'
import { cn } from '@/src/core/utils/cn';

const ShareQrCode = ({ qrValue, fromModal }: { qrValue: string, fromModal?: boolean }) => {
    const { t } = useTranslation();
    return (
        <View>
            <FontText type="body" weight="regular" className="text-content-secondary text-base mt-2 text-center">
                {t("Ask your customer to scan the QR code.")}
            </FontText>
            <View className={cn("items-center mt-4")}>
                <View className={cn(fromModal && "border border-stroke-input rounded p-4")}>
                    <QRCode
                        value={qrValue}
                        size={200} // Size of the QR code
                        color="black" // Color of the QR code
                        backgroundColor="white" // Background color
                    />
                </View>
            </View>
        </View>
    )
}

export default ShareQrCode