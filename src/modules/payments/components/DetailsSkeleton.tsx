import SkeletonLoader, { Spacer } from "@/src/shared/components/loaders/SkeletonLoader";
import { View } from "react-native";
import { cn } from "@/src/core/utils/cn";

const DetailsSkeleton: React.FC = () => {
    return (
        <View className="flex-1 px-4 pt-4">
            {/* Amount Display Area */}
            <View className="mb-4 ">
                <View className="flex-row items-center gap-x-2">
                    <SkeletonLoader width={120} height={28} radius={4} />
                    <SkeletonLoader width={80} height={24} radius={4} />
                </View>
                <Spacer height={4} />
                <SkeletonLoader width={150} height={16} radius={4} />
            </View>

            {/* Payment Method Details (Roughly) */}
            <View className="flex-row items-center gap-x-2 mb-6">
                <SkeletonLoader width={32} height={32} radius={4} />
                <View>
                    <SkeletonLoader width={100} height={14} radius={4} />
                </View>
            </View>

            {/* Summary Card */}
            <View className="w-full border-[1.5px] rounded border-tertiary mb-6 p-4">
                <View className="gap-y-4">
                    <View className="flex-row justify-between">
                        <SkeletonLoader width={100} height={14} radius={4} />
                        <SkeletonLoader width={80} height={14} radius={4} />
                    </View>
                    <View className="flex-row justify-between">
                        <SkeletonLoader width={100} height={14} radius={4} />
                        <SkeletonLoader width={120} height={14} radius={4} />
                    </View>
                    <View className="flex-row justify-between">
                        <SkeletonLoader width={60} height={14} radius={4} />
                        <SkeletonLoader width={90} height={14} radius={4} />
                    </View>
                </View>
            </View>

            {/* Tabs */}
            <View className="flex-row gap-x-4 mb-6">
                <SkeletonLoader width={80} height={32} radius={16} />
                <SkeletonLoader width={80} height={32} radius={16} />
                <SkeletonLoader width={80} height={32} radius={16} />
            </View>

            {/* Tab Content (Details Section Style) */}
            <View className="gap-y-6">
                <View className="gap-y-2">
                    <SkeletonLoader width={140} height={16} radius={4} />
                    <View className="w-full border-[1.5px] rounded border-tertiary p-4 gap-y-4">
                        <View className="flex-row justify-between">
                            <SkeletonLoader width={100} height={14} radius={4} />
                            <SkeletonLoader width={80} height={14} radius={4} />
                        </View>
                        <View className="flex-row justify-between">
                            <SkeletonLoader width={110} height={14} radius={4} />
                            <SkeletonLoader width={70} height={14} radius={4} />
                        </View>
                    </View>
                </View>

                <View className="gap-y-2 mt-4">
                    <SkeletonLoader width={140} height={16} radius={4} />
                    <View className="w-full border-[1.5px] rounded border-tertiary p-4 gap-y-4">
                        <View className="flex-row justify-between">
                            <SkeletonLoader width={90} height={14} radius={4} />
                            <SkeletonLoader width={120} height={14} radius={4} />
                        </View>
                    </View>
                </View>
                <View className="gap-y-2 ">
                    <SkeletonLoader width={140} height={16} radius={4} />
                    <View className="w-full border-[1.5px] rounded border-tertiary p-4 gap-y-4">
                        <View className="flex-row justify-between">
                            <SkeletonLoader width={90} height={14} radius={4} />
                            <SkeletonLoader width={120} height={14} radius={4} />
                        </View>
                        <View className="flex-row justify-between">
                            <SkeletonLoader width={90} height={14} radius={4} />
                            <SkeletonLoader width={120} height={14} radius={4} />
                        </View>
                        <View className="flex-row justify-between">
                            <SkeletonLoader width={90} height={14} radius={4} />
                            <SkeletonLoader width={120} height={14} radius={4} />
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default DetailsSkeleton;
