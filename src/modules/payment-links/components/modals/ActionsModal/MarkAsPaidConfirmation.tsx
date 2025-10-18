import Button from "@/src/shared/components/Buttons/Button";
import FontText from "@/src/shared/components/FontText";
import SimpleLoader from "@/src/shared/components/loaders/SimpleLoader";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";

interface MarkAsPaidConfirmationProps {
    onMarkAsPaid: () => void;
    onCancel: () => void;
    isMarkingAsPaid: boolean;
}

const MarkAsPaidConfirmation: FC<MarkAsPaidConfirmationProps> = ({ onMarkAsPaid, onCancel, isMarkingAsPaid }) => {
    const { t } = useTranslation();

    return (
        <View>
            <FontText type="body" weight="regular" className="text-light-gray text-base">
                {t("Are you sure you want to mark this payment link as paid?")}
            </FontText>
            <View className="mt-6 gap-y-4">
                <Button
                    disabled={isMarkingAsPaid}
                    isLoading={isMarkingAsPaid}
                    title={t('Confirm')}
                    onPress={onMarkAsPaid}
                />
                <Button
                    className="border-0"
                    title={t('Cancel')}
                    variant="outline"
                    onPress={onCancel}
                />
            </View>
        </View>
    );
};

export default MarkAsPaidConfirmation;