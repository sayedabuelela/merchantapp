import { BiometricFaceID, BiometricFingerprint } from "@/src/shared/assets/svgs";
import { View } from "react-native";

const AndroidBiometric = () => {
    return (
        <View className="flex-row justify-between items-center mt-10">
            <BiometricFingerprint
                width={80}
                height={80}
                style={{ marginRight: 40 }}
            />
            <BiometricFaceID
                width={80}
                height={80}
            />
        </View>
    )
};

export default AndroidBiometric;