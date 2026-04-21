import Button from "@/src/shared/components/Buttons/Button";
import FontText from "@/src/shared/components/FontText";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

interface ChangeRequestRejectedBannerProps {
    rejectionReason?: string;
    isDismissing: boolean;
    onDismiss: () => void;
}

const ChangeRequestRejectedBanner = ({
    rejectionReason,
    isDismissing,
    onDismiss,
}: ChangeRequestRejectedBannerProps) => {
    const { t } = useTranslation();

    return (
        <View className="bg-feedback-error-bg border border-stroke-feedback-danger p-3 rounded-lg mb-4">
            <FontText type="body" weight="semi" className="text-feedback-error mb-1">
                {t("Your change request was rejected")}
            </FontText>
            {rejectionReason ? (
                <FontText type="body" weight="regular" className="text-feedback-error mb-3">
                    {t("Reason")}: {rejectionReason}
                </FontText>
            ) : null}
            <Button
                variant="danger"
                size="sm"
                title={t("Dismiss")}
                isLoading={isDismissing}
                disabled={isDismissing}
                onPress={onDismiss}
            />
        </View>
    );
};

export default ChangeRequestRejectedBanner;
