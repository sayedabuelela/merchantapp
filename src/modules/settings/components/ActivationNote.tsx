import FontText from "@/src/shared/components/FontText"
import Button from "@/src/shared/components/Buttons/Button"
import { WarningSettingsIcon } from "@/src/shared/assets/svgs"
import { View } from "react-native"
import { useTranslation } from "react-i18next"

type ActivationStatus = 'pending' | 'submitted' | 'rejected';

interface ActivationNoteProps {
    goToOnboardingStatus?: () => void;
    status?: ActivationStatus;
}

const ActivationNote = ({ goToOnboardingStatus, status = 'pending' }: ActivationNoteProps) => {
    const { t } = useTranslation();

    const getMessage = () => {
        switch (status) {
            case 'submitted':
                return t("Our team is in the process of evaluating your profile for approval.");
            case 'rejected':
                return t("Your request is rejected");
            case 'pending':
            default:
                return t("Your account isn't active");
        }
    };

    const showButton = status !== 'submitted' && goToOnboardingStatus;

    return (
        <View className="flex-row items-center justify-between border border-[#FFD484] rounded p-3 bg-[#FFF7E8] mt-4">
            <View className="flex-row items-center flex-1">
                <WarningSettingsIcon />
                <FontText
                    type="body"
                    weight="regular"
                    className="text-[#1A541D] mx-2 text-sm self-start flex-1"
                >{getMessage()}</FontText>
            </View>
            {showButton && (
                <Button
                    variant='outline'
                    className='bg-[#FFF7E8] border border-[#513500]'
                    title={t('Activate Now')}
                    onPress={goToOnboardingStatus}
                    titleClasses='text-[#1A541D] text-sm'
                />
            )}
        </View>
    )
}

export default ActivationNote