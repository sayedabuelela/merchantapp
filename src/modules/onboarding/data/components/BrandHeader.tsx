import FontText from "@/src/shared/components/FontText";
import { Image } from "expo-image";
import { View } from "react-native";
interface BrandHeaderProps {
    companyName: string;
    logoUrl?: string;
}
const BrandHeader = ({ companyName, logoUrl }: BrandHeaderProps) => {
    return (
        <View className="items-center mb-6 mt-2">
            {logoUrl && (
                <Image
                    source={logoUrl}
                    className="w-16 h-16 rounded "
                    transition={100}
                />
            )}
            <FontText type="body" weight="bold" className="text-base text-content-primary mt-4" >{companyName}</FontText>
        </View>
    )
}

export default BrandHeader
