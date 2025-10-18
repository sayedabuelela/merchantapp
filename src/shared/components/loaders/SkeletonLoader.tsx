import { Skeleton as MotiSkeleton } from "moti/skeleton";
import React from "react";
import { DimensionValue, View } from "react-native";
type Size = number | DimensionValue
type SkeletonProps = {
    width?: Size;
    height?: Size;
    radius?: number;
};

const SkeletonLoader: React.FC<SkeletonProps> = ({
    width = "100%",
    height = 16,
    radius = 6,
}) => {
    return (
        <MotiSkeleton
            width={width}
            height={height}
            radius={radius}
            transition={{ type: "timing", duration: 1000 }}
            colors={["#F1EFEF", "#F9F8F8", "#E7E5E5"]}
        />
    );
};
export const Spacer = ({ height = 16 }) => <View style={{ height }} />;

export default SkeletonLoader;
