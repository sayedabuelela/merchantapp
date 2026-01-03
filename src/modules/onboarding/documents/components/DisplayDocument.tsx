import { DeleteDocumentIcon, PdfDocumentIcon } from "@/src/shared/assets/svgs";
import FontText from "@/src/shared/components/FontText";
import { Image } from 'expo-image';
import { AnimatePresence, MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import { TouchableOpacity, View } from "react-native";

interface DisplayDocumentProps {
    isLoadingDocument?: boolean;
    fileData?: { dataUri?: string, key?: string, mimeType?: string, deletable?: boolean };
    clearFile?: () => void;
}

const isPdfFile = (fileData?: { dataUri?: string, key?: string, mimeType?: string }) => {
    if (fileData?.mimeType?.includes('pdf')) return true;
    if (fileData?.key?.toLowerCase().endsWith('.pdf')) return true;
    if (fileData?.dataUri?.toLowerCase().endsWith('.pdf')) return true;
    return false;
};
const DisplayDocument = ({ isLoadingDocument, fileData, clearFile }: DisplayDocumentProps) => {
    const isPdf = isPdfFile(fileData);
    const hasFile = fileData?.dataUri || isPdf;

    return (
        <AnimatePresence >
            <MotiView
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{
                    opacity: 0,
                }}
                transition={{ type: 'timing', duration: 200 }}
            >
                <View className="mt-4 flex-row items-center justify-between border border-stroke-divider p-2 pr-3 rounded overflow-hidden">
                    {isLoadingDocument && (
                        <MotiView
                            key="skeleton-display-document"
                            from={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{
                                opacity: 0,
                            }}
                            transition={{ type: 'timing', duration: 300 }}
                        >
                            <View className="flex-row items-center w-[100%]">

                                <Skeleton
                                    colorMode="light"
                                    width={40}
                                    height={40}
                                />
                                <View style={{ width: 16, height: 16 }} />
                                <Skeleton
                                    radius={4}
                                    colorMode="light"
                                    width={'80%'}
                                    height={16}
                                />
                            </View>
                        </MotiView>
                    )}
                    {!isLoadingDocument && hasFile && (
                        <MotiView
                            key="display-document"
                            from={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{
                                opacity: 0,
                            }}
                            transition={{ type: 'timing', duration: 300 }}
                        >
                            <View className="flex-row items-center justify-between w-[100%]">
                                <View className={`flex-row items-center `}
                                    style={{
                                        width: fileData?.deletable ? '74%' : '85%'
                                    }}
                                >
                                    {isPdf ? (
                                        <View className="w-10 h-10 items-center justify-center">
                                            <PdfDocumentIcon width={40} height={40} />
                                        </View>
                                    ) : (
                                        <Image
                                            source={fileData?.dataUri}
                                            className="w-10 h-10 rounded "
                                            transition={100}
                                        />
                                    )}
                                    <FontText type="body" weight="regular" className="text-content-secondary text-xs ml-3" numberOfLines={1} ellipsizeMode="tail">
                                        {fileData?.key}
                                    </FontText>
                                </View>
                                {fileData?.deletable && (
                                    <TouchableOpacity onPress={clearFile}>
                                        <DeleteDocumentIcon />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </MotiView>
                    )}
                </View>
            </MotiView>
        </AnimatePresence>
    )
}

export default DisplayDocument
