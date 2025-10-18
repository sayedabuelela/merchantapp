import { InfoAlert } from "@/src/shared/assets/svgs";
import FontText from "@/src/shared/components/FontText";
import { View } from "react-native";

const DocumentRules = ({ rule }: { rule: string }) => {
    return (
        <View className="flex-row p-4 mb-4 bg-[#F1F6FF] border border-[#C0D5FF] rounded ">
            <InfoAlert />
            <FontText type="body" weight="regular" className="text-primary text-xs ml-2 self-start flex-1">
                {rule}
            </FontText>
        </View>
    )
}

export default DocumentRules;