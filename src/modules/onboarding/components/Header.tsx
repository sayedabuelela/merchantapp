import { BackIcon } from "@/src/shared/assets/svgs";
import FontText from "@/src/shared/components/FontText";
import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";

const Header = ({ title, progress }: { title: string, progress?: number }) => {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    }

    return (
        <View className="mb-8">
            <View className="flex-row items-center">
                <TouchableOpacity onPress={handleBack}>
                    <BackIcon />
                </TouchableOpacity>
                <FontText type="head" weight="bold" className="text-content-primary text-2xl ml-2 capitalize">{title}</FontText>
            </View>
            {progress && (
                <View className="w-full h-[4px] bg-[#F1F6FF] mt-6">
                    <View className={`h-[4px] bg-primary`} style={{ width: `${progress || 0}%` }} />
                </View>
            )}
        </View>
    )
}

export default Header;
