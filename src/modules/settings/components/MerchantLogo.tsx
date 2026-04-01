import { UserPersonalInfo } from '@/src/shared/assets/svgs';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { ImageStyle, StyleProp, View, ViewStyle } from 'react-native';

type MerchantLogoProps = {
    logoUrl?: string;
    size?: number;
    containerStyle?: StyleProp<ViewStyle>;
    imageStyle?: StyleProp<ImageStyle>;
};

const MerchantLogo = ({
    logoUrl,
    size = 40,
    containerStyle,
    imageStyle,
}: MerchantLogoProps) => {
    const [hasError, setHasError] = useState(false);

    const isValidUrl =
        logoUrl &&
        !logoUrl.includes("undefined") &&
        !hasError;

    if (!isValidUrl) {
        return (
            <View
                style={[
                    { width: size, height: size, alignItems: "center", justifyContent: "center" },
                    containerStyle,
                ]}
            >
                <UserPersonalInfo />
            </View>
        );
    }

    return (
        <Image
            source={{ uri: logoUrl }}
            style={[
                { width: size, height: size, borderRadius: size / 2 },
                imageStyle,
            ]}
            onError={() => setHasError(true)}
            contentFit="cover"
        />
    );
};

export default MerchantLogo;
