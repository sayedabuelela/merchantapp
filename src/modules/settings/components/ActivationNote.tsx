import FontText from "@/src/shared/components/FontText"
import Button from "@/src/shared/components/Buttons/Button"
import { WarningSettingsIcon } from "@/src/shared/assets/svgs"
import { View } from "react-native"
import { useTranslation } from "react-i18next"

const ActivationNote = ({ goToOnboardingStatus }: { goToOnboardingStatus: () => void }) => {
    const { t } = useTranslation();
    return (
        <View className="flex-row items-center justify-between border border-[#FFD484] rounded p-3 bg-[#FFF7E8]">
            <View className="flex-row items-center">
                <WarningSettingsIcon />
                <FontText
                    type="body"
                    weight="regular"
                    className="text-[#1A541D] mx-2 text-sm self-start "
                >{t('Your account isn’t active')}</FontText>
            </View>
            <Button
                variant='outline'
                className='bg-[#FFF7E8] border border-[#513500]'
                title={t('Activate Now')}
                onPress={goToOnboardingStatus}
                titleClasses='text-[#1A541D] text-sm'
            />
        </View>
    )
}

export default ActivationNote