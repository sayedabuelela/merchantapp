import { BiometricFingerprint } from "@/src/shared/assets/svgs";
import { BiometricFaceID } from "@/src/shared/assets/svgs";
import { View, Platform, TouchableOpacity } from "react-native";
import IosBiometric from "./IosBiometric";
import AndroidBiometric from "./AndroidBiometric";

const BiometricIcons = ({ onPress, isLoading }: { onPress?: () => void, isLoading?: boolean }) => {
    const isIOS = Platform.OS === 'ios';
    const isAndroid = Platform.OS === 'android';

    return (
        <View className="flex-row justify-between items-center mt-7">
            {/* {isIOS && (
                
            )} */}
            <TouchableOpacity onPress={onPress} disabled={!onPress || isLoading}>
                <IosBiometric isLoading={isLoading} />
            </TouchableOpacity>
            {/* {isAndroid && (
                <TouchableOpacity onPress={onPress} disabled={!onPress}>
                    <AndroidBiometric />
                </TouchableOpacity>
            )} */}
        </View>
    )
};

export default BiometricIcons;