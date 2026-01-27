import { Stack } from 'expo-router';

export default function FirstOnboardingLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor: '#FFFFFF'
                }
            }}
        />
    );
}
