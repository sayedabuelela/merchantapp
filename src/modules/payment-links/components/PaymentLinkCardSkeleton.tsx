import SkeletonLoader, { Spacer } from "@/src/shared/components/loaders/SkeletonLoader";
import { View } from "react-native";

const PaymentLinkCardSkeleton: React.FC = () => {
    return (
        <View>
            <SkeletonLoader width={120} height={22} radius={4} />
            <Spacer height={8} />
            <View className="w-full border-[1.5px] rounded border-tertiary mb-2 mt-2 p-4">
                <View className="flex-row  gap-x-2 mt-2">
                    <SkeletonLoader width={24} height={24} radius={4} />
                    <View className="">
                        <SkeletonLoader width={'85%'} height={14} radius={4} />
                        <Spacer height={8} />
                        <View className="flex-row gap-x-2">
                            <SkeletonLoader width={80} height={11} radius={4} />
                            <SkeletonLoader width={80} height={11} radius={4} />
                        </View>
                        <Spacer height={8} />
                        <View className="flex-row gap-x-2">
                            <SkeletonLoader width={120} height={14} radius={4} />
                            <SkeletonLoader width={50} height={14} radius={4} />
                        </View>
                    </View>
                </View>
            </View>
            <View className="w-full border-[1.5px] rounded border-tertiary mb-2 mt-2 p-4">
                <View className="flex-row  gap-x-2 mt-2">
                    <SkeletonLoader width={24} height={24} radius={4} />
                    <View className="">
                        <SkeletonLoader width={'85%'} height={14} radius={4} />
                        <Spacer height={8} />
                        <View className="flex-row gap-x-2">
                            <SkeletonLoader width={80} height={11} radius={4} />
                            <SkeletonLoader width={80} height={11} radius={4} />
                        </View>
                        <Spacer height={8} />
                        <View className="flex-row gap-x-2">
                            <SkeletonLoader width={120} height={14} radius={4} />
                            <SkeletonLoader width={50} height={14} radius={4} />
                        </View>
                    </View>
                </View>
            </View>
            <View className="w-full border-[1.5px] rounded border-tertiary mb-2 mt-2 p-4">
                <View className="flex-row  gap-x-2 mt-2">
                    <SkeletonLoader width={24} height={24} radius={4} />
                    <View className="">
                        <SkeletonLoader width={'85%'} height={14} radius={4} />
                        <Spacer height={8} />
                        <View className="flex-row gap-x-2">
                            <SkeletonLoader width={80} height={11} radius={4} />
                            <SkeletonLoader width={80} height={11} radius={4} />
                        </View>
                        <Spacer height={8} />
                        <View className="flex-row gap-x-2">
                            <SkeletonLoader width={120} height={14} radius={4} />
                            <SkeletonLoader width={50} height={14} radius={4} />
                        </View>
                    </View>
                </View>
            </View>
            <Spacer height={12} />
            <SkeletonLoader width={120} height={22} radius={4} />
            <Spacer height={8} />
            <View className="w-full border-[1.5px] rounded border-tertiary mb-2 mt-2 p-4">
                <View className="flex-row  gap-x-2 mt-2">
                    <SkeletonLoader width={24} height={24} radius={4} />
                    <View className="">
                        <SkeletonLoader width={'85%'} height={14} radius={4} />
                        <Spacer height={8} />
                        <View className="flex-row gap-x-2">
                            <SkeletonLoader width={80} height={11} radius={4} />
                            <SkeletonLoader width={80} height={11} radius={4} />
                        </View>
                        <Spacer height={8} />
                        <View className="flex-row gap-x-2">
                            <SkeletonLoader width={120} height={14} radius={4} />
                            <SkeletonLoader width={50} height={14} radius={4} />
                        </View>
                    </View>
                </View>
            </View>
            <View className="w-full border-[1.5px] rounded border-tertiary mb-2 mt-2 p-4">
                <View className="flex-row  gap-x-2 mt-2">
                    <SkeletonLoader width={24} height={24} radius={4} />
                    <View className="">
                        <SkeletonLoader width={'85%'} height={14} radius={4} />
                        <Spacer height={8} />
                        <View className="flex-row gap-x-2">
                            <SkeletonLoader width={80} height={11} radius={4} />
                            <SkeletonLoader width={80} height={11} radius={4} />
                        </View>
                        <Spacer height={8} />
                        <View className="flex-row gap-x-2">
                            <SkeletonLoader width={120} height={14} radius={4} />
                            <SkeletonLoader width={50} height={14} radius={4} />
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default PaymentLinkCardSkeleton;