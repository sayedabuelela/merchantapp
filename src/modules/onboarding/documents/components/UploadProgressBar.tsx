import React, { useEffect, useRef, useState } from "react";
import { Animated, View } from "react-native";

interface UploadProgressBarProps {
    step: number,
    steps: number,
}

const UploadProgressBar = ({ step, steps }: UploadProgressBarProps) => {
    const [width, setWidth] = useState(0)

    const animatedValue = useRef(new Animated.Value(-1000)).current;
    const reactive = useRef(new Animated.Value(-1000)).current;

    useEffect(() => {

        Animated.timing(animatedValue, {
            toValue: reactive,
            duration: 800,
            useNativeDriver: true,
        }).start();

    }, []);

    useEffect(() => {
        reactive.setValue(-width + (width * step) / steps);
    }, [step, width]);

    return (
        <View
            onLayout={(e) => {
                const newWidth = e.nativeEvent.layout.width;
                setWidth(newWidth);
            }}
            className="overflow-hidden h-2 rounded-full bg-[rgba(0,0,0,0.1)] mt-3 shadow-[0px_0px_1px_0px_rgba(0,0,0,0.25)]"
        >
            <Animated.View
                className="absolute left-0 top-0 bg-primary h-2 rounded-full w-full"
                style={{
                    transform: [{
                        translateX: animatedValue,
                    }]
                }} />
        </View>
    );
};

export default UploadProgressBar;
