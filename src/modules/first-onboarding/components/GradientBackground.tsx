import { memo } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';

const GradientBackground = memo(() => {
    return (
        <Svg style={StyleSheet.absoluteFill}>
            <Defs>
                {/* Teal gradient - center-right area, pulled from edges */}
                <RadialGradient
                    id="teal"
                    cx="70%"
                    cy="60%"
                    rx="50%"
                    ry="40%"
                >
                    <Stop offset="0%" stopColor="#00BCB4" stopOpacity="1" />
                    <Stop offset="70%" stopColor="#EAFFFE" stopOpacity="0.3" />
                    <Stop offset="100%" stopColor="#EAFFFE" stopOpacity="0" />
                </RadialGradient>

                {/* Dark Blue gradient - center-left area, pulled from edges */}
                <RadialGradient
                    id="blue"
                    cx="30%"
                    cy="40%"
                    rx="45%"
                    ry="40%"
                >
                    <Stop offset="0%" stopColor="#001F5F" stopOpacity="1" />
                    <Stop offset="70%" stopColor="#F1F6FF" stopOpacity="0.3" />
                    <Stop offset="100%" stopColor="#F1F6FF" stopOpacity="0" />
                </RadialGradient>

                {/* Orange/Peach gradient - upper right, pulled from corner */}
                <RadialGradient
                    id="orange"
                    cx="75%"
                    cy="25%"
                    rx="40%"
                    ry="30%"
                >
                    <Stop offset="0%" stopColor="#E28658" stopOpacity="1" />
                    <Stop offset="70%" stopColor="#FFF5F0" stopOpacity="0.3" />
                    <Stop offset="100%" stopColor="#FFF5F0" stopOpacity="0" />
                </RadialGradient>

                {/* White gradient - center bottom area */}
                <RadialGradient
                    id="white"
                    cx="50%"
                    cy="85%"
                    rx="60%"
                    ry="40%"
                >
                    <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                    <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                </RadialGradient>
            </Defs>

            {/* Render gradients as overlapping rectangles */}
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#white)" />
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#blue)" />
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#orange)" />
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#teal)" />
        </Svg>
    );
});

GradientBackground.displayName = 'GradientBackground';

export default GradientBackground;
