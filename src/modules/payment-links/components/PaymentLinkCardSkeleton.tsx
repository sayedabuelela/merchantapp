import SkeletonLoader, { Spacer } from "@/src/shared/components/loaders/SkeletonLoader";
import { View } from "react-native";

/** Mirrors RecordCard: identity on the left, money and state on the right. */
const CardBlock = () => (
    <View className="w-full border border-tertiary rounded mb-2 p-4">
        <View className="flex-row items-start gap-x-2">
            <View className="flex-1">
                <SkeletonLoader width={'70%'} height={14} radius={4} />
                <Spacer height={4} />
                <SkeletonLoader width={80} height={12} radius={4} />
                <Spacer height={8} />
                <View className="flex-row gap-x-1">
                    <SkeletonLoader width={90} height={14} radius={2} />
                    <SkeletonLoader width={70} height={14} radius={2} />
                </View>
            </View>
            <View className="items-end">
                <SkeletonLoader width={90} height={14} radius={4} />
                <Spacer height={4} />
                <SkeletonLoader width={70} height={12} radius={4} />
                <Spacer height={4} />
                <SkeletonLoader width={50} height={12} radius={2} />
            </View>
        </View>
    </View>
);

const PaymentLinkCardSkeleton: React.FC = () => {
    return (
        <View>
            <SkeletonLoader width={120} height={22} radius={4} />
            <Spacer height={8} />
            <CardBlock />
            <CardBlock />
            <CardBlock />
            <Spacer height={12} />
            <SkeletonLoader width={120} height={22} radius={4} />
            <Spacer height={8} />
            <CardBlock />
            <CardBlock />
        </View>
    );
};

export default PaymentLinkCardSkeleton;
