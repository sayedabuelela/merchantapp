import FontText from "@/src/shared/components/FontText";
import { Image } from "expo-image";
import { View } from "react-native";

interface DataDocumentRowProps {
    label: string;
    url?: string;
}

const DataDocumentRow = ({ label, url }: DataDocumentRowProps) => (
    url ? (
        <View className="flex-row items-center justify-between mb-4 ">
            <FontText type="body" weight="regular" className={` text-[#6F7E7E] text-sm mr-3 self-start`}>{label}</FontText>
            {url && (
                <Image
                    source={url}
                    className="w-8 h-8 rounded"
                    transition={100}
                    // progressiveRenderingEnabled={true}
                />
            )}
        </View>
    ) : null
);

export default DataDocumentRow;
