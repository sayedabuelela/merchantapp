import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import GradientBackground from './GradientBackground';

const SlideBackground = memo(() => {
    return (
        <View style={[StyleSheet.absoluteFill, { zIndex: -1, overflow: 'hidden' }]}>
            {/* Gradient inside BlurView to actually blur it */}
            <BlurView
                intensity={100}
                tint="light"
                style={StyleSheet.absoluteFill}
            >
                <GradientBackground />
            </BlurView>
            {/* White overlay to further soften */}
            <View
                style={[
                    StyleSheet.absoluteFill,
                    { backgroundColor: 'rgba(255, 255, 255, 0.6)' }
                ]}
                pointerEvents="none"
            />
        </View>
    );
});

SlideBackground.displayName = 'SlideBackground';

export default SlideBackground;
