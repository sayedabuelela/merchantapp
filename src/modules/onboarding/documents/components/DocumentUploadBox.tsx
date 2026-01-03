import { UploadIcon } from "@/src/shared/assets/svgs";
import FontText from "@/src/shared/components/FontText";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import { UploadProgressState } from "../documents.model";
import DisplayDocument from "./DisplayDocument";
import UploadProgressBar from "./UploadProgressBar";

interface DocumentUploadBoxProps {
    title: string;
    handleUpload: () => void;
    isUploading?: boolean;
    isLoadingDocument?: boolean;
    fileData?: { dataUri?: string, key?: string, mimeType?: string, deletable?: boolean };
    clearFile?: () => void;
    uploadProgress?: UploadProgressState | null;
}

const DocumentUploadBox = ({
    title,
    handleUpload,
    isUploading,
    isLoadingDocument,
    fileData,
    clearFile,
    uploadProgress,
}: DocumentUploadBoxProps) => {
    const { t } = useTranslation();
    console.log('fileData : ', fileData);
    return (
        <>
            <View
                // className="p-4 bg-white rounded-md shadow-[0px_0px_3px_0px_rgba(0,0,0,0.25)] "
                className="p-4 bg-white rounded-md border border-stroke-main"
                style={{ elevation: 3 }}
            >
                <View className="flex-row items-center justify-between">
                    <View >
                        <FontText type="body" weight="semi" className="text-content-primary text-base self-start">
                            {title}
                        </FontText>
                        <FontText type="body" weight="regular" className="text-content-hint text-sm self-start">JPG, PNG, PDF</FontText>
                    </View>
                    <TouchableOpacity
                        onPress={handleUpload}
                        disabled={isUploading || isLoadingDocument}
                        className="flex-row items-center p-3 bg-transparent rounded border border-primary active:border-primary/70 "
                    >
                        <UploadIcon />
                        <FontText type="body" weight="semi" className="text-primary text-sm self-start ml-2">{t('Upload')}</FontText>
                    </TouchableOpacity>
                </View>
                {(fileData?.dataUri || fileData?.mimeType?.includes('pdf')) && <DisplayDocument
                    isLoadingDocument={isLoadingDocument}
                    fileData={fileData}
                    clearFile={clearFile}
                />}

            </View>
            {uploadProgress && <UploadProgressBar step={uploadProgress?.percentage || 0} steps={100} />}
        </>
    )
}

export default DocumentUploadBox;