import Button from "@/src/shared/components/Buttons/Button";
import FontText from "@/src/shared/components/FontText";
import SimpleLoader from "@/src/shared/components/loaders/SimpleLoader";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";

interface DeleteConfirmationProps {
    onDelete: () => void;
    onCancel: () => void;
    isDeleting: boolean;
}

const DeleteConfirmation: FC<DeleteConfirmationProps> = ({ onDelete, onCancel, isDeleting }) => {
    const { t } = useTranslation();

    return (
        <View>
            <FontText type="body" weight="regular" className="text-content-secondary text-base">
                {t("Are you sure you want to delete this payment link?")}
            </FontText>
            <View className="mt-6 gap-y-4">
                <Button
                    disabled={isDeleting}
                    isLoading={isDeleting}
                    title={t('Delete')}
                    variant="danger"
                    onPress={onDelete}
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

export default DeleteConfirmation;