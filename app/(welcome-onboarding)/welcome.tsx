import { useAuthStore } from "@/src/modules/auth/auth.store";
import Button from "@/src/shared/components/Buttons/Button";
import { Text, View } from "react-native";

const Welcome = () => {
    const {clearAuth} = useAuthStore();
    const logout = () => {
        clearAuth();
    }
    return (
        <View className={'pt-16'}>
            <Text>Welcome Onboarding</Text>
            <Button
                title={'Logout'}
                onPress={logout}
            />
        </View>

    )
}

export default Welcome;