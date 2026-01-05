import { PdfDocumentIcon } from "@/src/shared/assets/svgs";
import FontText from "@/src/shared/components/FontText";
import { Image } from "expo-image";
import { View } from "react-native";

interface DataDocumentRowProps {
    label: string;
    url?: string;
    mimeType?: string;
}

const isPdf = (mimeType?: string) => mimeType?.toLowerCase().includes('pdf');

const DataDocumentRow = ({ label, url, mimeType }: DataDocumentRowProps) => (
    url ? (
        <View className="flex-row items-center justify-between mb-4 ">
            <FontText type="body" weight="regular" className="text-[#6F7E7E] text-sm mr-3 flex-1">{label}</FontText>
            {isPdf(mimeType) ? (
                <PdfDocumentIcon width={32} height={32} />
            ) : (
                <Image
                    source={{ uri: url }}
                    style={{ width: 32, height: 32, borderRadius: 4 }}
                    contentFit="cover"
                    transition={100}
                />
            )}
        </View>
    ) : null
);

export default DataDocumentRow;
