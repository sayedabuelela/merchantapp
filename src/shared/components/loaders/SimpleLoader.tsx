import LottieView from "lottie-react-native";
import React, { FC } from "react";
import { View } from "react-native";

const SimpleLoader: FC<{ size?: number }> = ({ size = 24 }) => {
    return (
        <View className="flex-1 justify-center items-center">
            <LottieView
                source={require("../../assets/animations/simple-loader-1.json")}
                autoPlay
                loop
                style={{
                    width: size,
                    height: size,
                }}
            />
        </View>
    )
}

export default SimpleLoader;