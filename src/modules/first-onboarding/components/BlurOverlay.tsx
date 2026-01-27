import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';

const BlurOverlay = memo(() => {
    return (
        <View style={StyleSheet.absoluteFill}>
            {/* Blur layer */}
            <BlurView
                intensity={100}
                tint="light"
                style={StyleSheet.absoluteFill}
            />
            {/* White overlay to further soften the gradients */}
            <View
                style={[
                    StyleSheet.absoluteFill,
                    { backgroundColor: 'rgba(255, 255, 255, 0.7)' }
                ]}
            />
        </View>
    );
});

BlurOverlay.displayName = 'BlurOverlay';

export default BlurOverlay;
