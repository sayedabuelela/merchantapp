import CreatePaymentModal from "@/src/modules/payment-links/components/modals/CreatePaymentModal";
import { AddIcon } from "@/src/shared/assets/svgs";
import { Tabs } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Cog6ToothIcon } from 'react-native-heroicons/outline';
import { ArrowsUpDownIcon, HomeIcon, LinkIcon } from 'react-native-heroicons/solid';


const _TabsLayout = () => {
    const [isModalVisible, setModalVisible] = useState(false);

    const handleAddPress = () => {
        setModalVisible(!isModalVisible);
    };
    // const initializeAuth = useAuthStore(selectAuthInitialize);
    // const isAuthenticated = useAuthStore(selectIsAuthenticated);
    // const hasBiometricEnabled = useBiometricStore(selectIsEnabled);

    // if (!initializeAuth) {
    //     // Optional: Show a loading indicator
    //     return null;
    // }

    // if (!isAuthenticated) {
    //     const loginRoute = hasBiometricEnabled
    //         ? ROUTES.AUTH.LOGIN_BIOMETRIC
    //         : ROUTES.AUTH.LOGIN;
    //     return <Redirect href={loginRoute} />;
    // }

    return (
        <>
            <Tabs
                screenOptions={{
                    tabBarStyle: styles.tabBar,
                    tabBarHideOnKeyboard: true,
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarActiveTintColor: '#001F5F',
                    tabBarInactiveTintColor: '#919C9C',
                }}
            >
                <Tabs.Screen name="balance" options={{ tabBarIcon: ({ color }) => <HomeIcon color={color} /> }} />
                <Tabs.Screen name="transactions" options={{ tabBarIcon: ({ color }) => <ArrowsUpDownIcon color={color} /> }} />
                <Tabs.Screen
                    name="add"
                    options={{
                        tabBarButton: () => (
                            <TouchableOpacity
                                style={styles.addIcon}
                                onPress={() => {
                                    handleAddPress();
                                }}
                            >
                                <View style={styles.addIconTopHalf} />
                                <View style={styles.addIconBottomHalf} />
                                <View style={styles.addIconIconContainer}>
                                    <AddIcon />
                                </View>
                            </TouchableOpacity>
                        ),

                    }}
                />
                <Tabs.Screen name="payment-links" options={{ tabBarIcon: ({ color }) => <LinkIcon color={color} /> }} />
                <Tabs.Screen name="settings" options={{ tabBarIcon: ({ color }) => <Cog6ToothIcon color={color} /> }} />
            </Tabs>
            <CreatePaymentModal isVisible={isModalVisible} onClose={handleAddPress} />
        </>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#fff',
        paddingTop: 10,
        height: 70,
        paddingHorizontal: 26,
        shadowColor: '#4785FE',
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    addIcon: {
        marginTop: -35,
        width: 55,
        height: 55,
        borderRadius: 30,
        overflow: "hidden",
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#4785FE",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    addIconTopHalf: {
        flex: 1,
        width: "100%",
        backgroundColor: "transparent"
    },
    addIconBottomHalf: {
        flex: 1,
        width: "100%",
        backgroundColor: "#F8FAFE"
    },
    addIconIconContainer: {
        position: "absolute"
    }
})

export default _TabsLayout;
