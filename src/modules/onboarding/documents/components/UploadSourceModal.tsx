import Button from "@/src/shared/components/Buttons/Button";
import FontText from "@/src/shared/components/FontText";
import { AnimatePresence, MotiView } from 'moti';
import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Modal,
    Platform,
    Pressable,
    TouchableOpacity,
    View
} from "react-native";


interface IUploadSourceModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSelectCamera: () => void;
    onSelectGallery: () => void;
    onSelectFiles: () => void;
}

const UploadSourceModal: FC<IUploadSourceModalProps> = ({
    isVisible,
    onClose,
    onSelectCamera,
    onSelectGallery,
    onSelectFiles,
}) => {
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(isVisible);

    useEffect(() => {
        if (isVisible) {
            setShowModal(true);
        }
    }, [isVisible]);

    const handleClose = () => {
        onClose();
    };
    return (
        <Modal
            transparent
            visible={showModal}
            animationType="none"
            onRequestClose={handleClose}
        >
            <AnimatePresence
                onExitComplete={() => setShowModal(false)} // close modal *after* exit anim finishes
            >
                {isVisible && (
                    <View className="flex-1 justify-end">
                        {/* 🔹 Background overlay */}
                        <MotiView
                            from={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 300 }}
                            className="absolute inset-0 bg-content-secondary/30"
                        >
                            <Pressable style={{ flex: 1 }} onPress={handleClose} />
                        </MotiView>
                        <MotiView
                            from={{ translateY: 300 }}
                            animate={{ translateY: 0 }}
                            exit={{ translateY: 300 }} // slide down
                            transition={{ type: 'timing', duration: 400 }}
                            className={`
                                        bg-white w-full rounded-t-3xl pt-4 shadow-sm
                                        ${Platform.OS === 'ios' ? 'pb-10' : 'pb-6'}
                                      `}
                        >
                            <View className="w-8 h-[3px] bg-content-secondary rounded-full self-center mb-8" />
                            <View className="px-6">
                                <FontText type="head" weight="bold" className="text-content-primary text-xl self-start mb-6">
                                    {t('Please select document type')}
                                </FontText>
                            </View>
                            {/* Content dont modify */}
                            <View className="px-6">
                                <Button
                                    className="mb-2 border border-[#F5F6F6]"
                                    titleClasses="text-content-secondary"
                                    variant="outline"
                                    title={t('Open Camera')}
                                    onPress={() => {
                                        onSelectCamera();
                                        onClose();
                                    }}
                                />
                                <Button
                                    className="mb-2 border border-[#F5F6F6]"
                                    titleClasses="text-content-secondary"
                                    variant="outline"
                                    title={t('Select from Gallery')}
                                    onPress={() => {
                                        onSelectGallery();
                                        onClose();
                                    }}
                                />
                                <Button
                                    className="mb-2 border border-[#F5F6F6]"
                                    titleClasses="text-content-secondary"
                                    variant="outline"
                                    title={t('Select from Files')}
                                    onPress={() => {
                                        onSelectFiles();
                                        onClose();
                                    }}
                                />

                                <TouchableOpacity
                                    onPress={onClose}
                                    className="p-3 bg-transparent rounded self-center mt-2"
                                >
                                    <FontText type="body" weight="semi" className="text-danger text-base self-start ml-2">{t('Cancel')}</FontText>
                                </TouchableOpacity>
                            </View>
                        </MotiView>
                    </View>
                )}
            </AnimatePresence>
        </Modal>
    );
};

export default UploadSourceModal;