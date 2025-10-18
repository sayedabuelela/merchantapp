import LottieView from "lottie-react-native";
import React, { FC } from "react";
import { View } from "react-native";

const SimpleLoader: FC = () => {
    return (
        <View className="flex-1 justify-center items-center">
            <LottieView
                source={require("../../assets/animations/simple-loader-1.json")}
                autoPlay
                loop
                style={{
                    width: 24,
                    height: 24,
                }}
            />
        </View>
    )
}

export default SimpleLoader;