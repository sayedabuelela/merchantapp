import { Platform, TouchableOpacity, View } from "react-native";
import AndroidBiometric from "./AndroidBiometric";
import IosBiometric from "./IosBiometric";

const BiometricIcons = ({ onPress, isLoading }: { onPress?: () => void, isLoading?: boolean }) => {
    const isIOS = Platform.OS === 'ios';
    const isAndroid = Platform.OS === 'android';

    return (
        <View className="flex-row justify-between items-center mt-7">
            {isIOS && (
                <TouchableOpacity onPress={onPress} disabled={!onPress || isLoading}>
                    <IosBiometric isLoading={isLoading} />
                </TouchableOpacity>
            )}

            {isAndroid && (
                <TouchableOpacity onPress={onPress} disabled={!onPress}>
                    <AndroidBiometric />
                </TouchableOpacity>
            )}
        </View>
    )
};

export default BiometricIcons;