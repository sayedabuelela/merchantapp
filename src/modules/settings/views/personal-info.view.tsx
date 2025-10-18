import FontText from "@/src/shared/components/FontText";
import { SafeAreaView } from "react-native-safe-area-context"

const PersonalInfoScreen = () => {
    return (
        <SafeAreaView className="bg-white">
            <FontText className="text-2xl font-bold">Personal Info</FontText>
        </SafeAreaView>
    )
}

export default PersonalInfoScreen;