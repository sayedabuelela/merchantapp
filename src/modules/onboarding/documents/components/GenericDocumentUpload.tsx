import { ROUTES } from "@/src/core/navigation/routes";
import Button from "@/src/shared/components/Buttons/Button";
import SkipButton from "@/src/shared/components/Buttons/SkipButton";
import { Route, useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { useFilePicker } from "../../hooks/useFilePicker";
import { useOnboardingStore } from "../../onboarding.store";
import { DocumentType } from "../documents.model";
import { useDocumentsStore } from "../documents.store";
import useDocumentViewModel from "../documents.viewmodel";
import DocumentRules from "./DocumentRules";
import DocumentUploadBox from "./DocumentUploadBox";
import UploadSourceModal from "./UploadSourceModal";
import { FadeInDownView, FadeInUpView, ScaleView } from "@/src/shared/components/wrappers/animated-wrappers";

interface GenericDocumentUploadScreenProps {
    headerTitle?: string;
    progress: number;
    documentRule: string;
    documentUploadBoxTitle: string;
    documentType: DocumentType;
    nextRoute: Route;
    onboardingStoreSelector?: (state: ReturnType<typeof useOnboardingStore>) => any;
    isOptional?: boolean;
}

const GenericDocumentUploadScreen = ({
    headerTitle,
    progress,
    documentRule,
    documentUploadBoxTitle,
    documentType,
    nextRoute,
    onboardingStoreSelector,
    isOptional = false,
}: GenericDocumentUploadScreenProps) => {
    const { t } = useTranslation();
    const router = useRouter();
    const addOrUpdateDocument = useDocumentsStore(state => state.addOrUpdateDocument);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const openModal = () => setIsModalVisible(true);
    const closeModal = () => setIsModalVisible(false);

    const { currentFileKey, displayableFileUri, handleUploadDocumentStep, isUploading, isLoadingDocument, uploadProgress } = useDocumentViewModel({ documentType });
    const {
        image,
        document,
        pickImage,
        pickDocument,
        clearImage,
        clearDocument,
        selectCamera,
        isLoading: isPicking
    } = useFilePicker();

    const handleSubmit = async () => {
        if (currentFileKey && !image) {
            addOrUpdateDocument({
                key: currentFileKey,
                documentType,
                isDeleted: false,
                isReviewd: false,
            });

            await handleUploadDocumentStep(null, nextRoute);
        } else if (image) {
            await handleUploadDocumentStep(image, nextRoute);
        } else {
            await handleUploadDocumentStep(null, nextRoute);
        }
    }


    const handleSkip = () => {
        router.replace(ROUTES.TABS.HOME);
    }

    return (
        <SafeAreaView className="flex-1 px-6 pb-4 bg-white">
            <FadeInDownView delay={0} duration={600}>
                <Header title={t('Business Document')} progress={progress} />
            </FadeInDownView>
            <View className="flex-1 justify-between">
                <View>
                    <FadeInUpView delay={150} duration={600}>
                        <DocumentRules rule={documentRule} />
                    </FadeInUpView>
                    <ScaleView delay={250} duration={600}>
                        <DocumentUploadBox
                            title={documentUploadBoxTitle}
                            handleUpload={openModal}
                            isUploading={isUploading}
                            isLoadingDocument={isLoadingDocument}
                            fileData={image ? { dataUri: image?.uri, key: image?.name, deletable: true } : { dataUri: displayableFileUri, key: currentFileKey, deletable: false }}
                            clearImage={clearImage}
                            clearDocument={clearDocument}
                            uploadProgress={uploadProgress}
                        />
                    </ScaleView>
                </View>

                <View>
                    <FadeInUpView delay={350} duration={600}>
                        <Button
                            className='mt-6'
                            title={t('Continue')}
                            isLoading={isPicking || isUploading}
                            disabled={
                                isOptional
                                    ? (isPicking || isUploading)
                                    : ((!image && !displayableFileUri) || isPicking || isUploading)
                            }
                            onPress={handleSubmit}
                        />
                    </FadeInUpView>
                    <FadeInUpView delay={450} duration={600}>
                        <SkipButton onPress={handleSkip} />
                    </FadeInUpView>
                </View>
                <UploadSourceModal
                    isVisible={isModalVisible}
                    onClose={closeModal}
                    onSelectCamera={selectCamera}
                    onSelectGallery={pickImage}
                    onSelectFiles={pickDocument}
                />
            </View>
        </SafeAreaView>
    )
}

export default GenericDocumentUploadScreen;
