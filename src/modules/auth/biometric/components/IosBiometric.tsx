import { BiometricFaceID } from "@/src/shared/assets/svgs";
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

const IosBiometric = ({ isLoading }: { isLoading?: boolean }) => {
    const scanLineAnimation = useRef(new Animated.Value(0)).current;
    const pulseAnimation = useRef(new Animated.Value(1)).current;
    useEffect(() => {
        if (isLoading) {
            // Scanning line animation (vertical movement)
            Animated.loop(
                Animated.sequence([
                    Animated.timing(scanLineAnimation, {
                        toValue: 1,
                        duration: 2000,
                        easing: Easing.linear,
                        useNativeDriver: false
                    }),
                    Animated.timing(scanLineAnimation, {
                        toValue: 0,
                        duration: 2000,
                        easing: Easing.linear,
                        useNativeDriver: false
                    })
                ])
            ).start();

            // Pulse animation (slight scaling effect)
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnimation, {
                        toValue: 1.05,
                        duration: 1000,
                        easing: Easing.bezier(0.4, 0, 0.2, 1),
                        useNativeDriver: true
                    }),
                    Animated.timing(pulseAnimation, {
                        toValue: 1,
                        duration: 1000,
                        easing: Easing.bezier(0.4, 0, 0.2, 1),
                        useNativeDriver: true
                    })
                ])
            ).start();

        } else {
            // Stop animations when not loading
            scanLineAnimation.stopAnimation();
            pulseAnimation.stopAnimation();
        }

        // Cleanup animations on unmount
        return () => {
            scanLineAnimation.stopAnimation();
            pulseAnimation.stopAnimation();
        };
    }, [isLoading]);


    const scanLineTop = scanLineAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['27%', '135%']
    });

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.iconContainer,
                    {
                        transform: [{ scale: pulseAnimation }]
                    }
                ]}
            >
                <BiometricFaceID width={90} height={90} />
            </Animated.View>

            {isLoading && (
                <Animated.View
                    style={[
                        styles.scanLine,
                        {
                            top: scanLineTop,
                        }
                    ]}
                />
            )}

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
        borderWidth: 1,
        borderColor: '#00BCB4',
        borderRadius: 8,
        padding: 28,
        position: 'relative',
        overflow: 'hidden',
    },
    iconContainer: {
        width: 90,
        height: 90,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanLine: {
        position: 'absolute',
        width: '140%',
        height: 2,
        backgroundColor: '#00BCB4',
        opacity: 0.5,
        shadowColor: '#00BCB4',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 5,
    },
    glowEffect: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderWidth: 1,
        borderColor: 'rgba(0, 188, 180, 0.2)',
    },
    text: {
        marginTop: 16,
        color: '#00BCB4',
        fontWeight: '500',
        fontSize: 16,
    }
});
export default IosBiometric;