import React, { FC } from "react";
import { Pressable, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import Input from "@/src/shared/components/inputs/Input";
import SimpleLoader from "@/src/shared/components/loaders/SimpleLoader";
import FontText from "@/src/shared/components/FontText";
import { XMarkIcon } from "react-native-heroicons/outline";
import Button from "@/src/shared/components/Buttons/Button";
interface RejectConfirmationProps {
    rejectReason: string;
    setRejectReason: (reason: string) => void;
    onReject: (reason: string) => void;
    isLoading: boolean;
}

const RejectConfirmation: FC<RejectConfirmationProps> = ({ rejectReason, setRejectReason, onReject, isLoading }) => {
    const { t } = useTranslation();

    return (
        <View>
            <Input
                className="h-24 pt-2"
                label={t("Reason of rejection")}
                placeholder={t("Type a reason of rejection")}
                value={rejectReason}
                onChangeText={setRejectReason}
                multiline
            // error={!!errors.customer?.name}
            />
            <Button
                disabled={isLoading || rejectReason.trim() === ""}
                title={t('Reject Payment Link')}
                variant="danger"
                onPress={() => onReject(rejectReason)}
                className="mt-4"
                fontWeight="regular"
            />
        </View>
    );
};

export default RejectConfirmation;